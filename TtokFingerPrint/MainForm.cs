using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using UNIONCOMM.SDK.UCBioBSP;
using System.Threading;
using System.Diagnostics;

using TtokFingerPrint.Net;
using TtokFingerPrint.Utility;
using System.Media;
using Newtonsoft.Json.Linq;

namespace TtokFingerPrint
{
    public partial class MainForm : Form
    {

        UCBioAPI m_UCBioAPI;
        UCBioAPI.FastSearch m_FastSearch;
        UCBioAPI.Type.INIT_INFO_0 m_InitInfo0;
        UCBioAPI.Type.WINDOW_OPTION winOption;

        List<UCBioAPI.FastSearch.FP_INFO> m_fpInfoList = new List<UCBioAPI.FastSearch.FP_INFO>();

        bool m_bStopFlag = false;

        System.Windows.Forms.Timer dispTimer = new System.Windows.Forms.Timer();

        public MainForm()
        {
            InitializeComponent();

            // 멀티 스크린을 사용하는 User인 경우라면
            if (Screen.AllScreens.Count() > 1)
            {
                GFunc.showOnMonitor(this, GFunc.GetMonitorNo());
            }

            // 지문 인식 장치 준비
            m_UCBioAPI = new UCBioAPI();
            m_FastSearch = new UCBioAPI.FastSearch(m_UCBioAPI);
            this.winOption = new UCBioAPI.Type.WINDOW_OPTION();
            this.winOption.FingerWnd = 0;
            this.winOption.WindowStyle = UCBioAPI.Type.WINDOW_STYLE.INVISIBLE;

            // 키보드 인식
            KeyPreview = true;
            KeyUp += Form_KeyUp;

        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // 로고
            pbLogo.Left = (this.ClientSize.Width - pbLogo.Width) / 2;
            pbLogo.Top = 50;

            // 스탠바이
            pbFingerPrintStandby.Left = (this.ClientSize.Width - pbFingerPrintStandby.Width) / 2;
            pbFingerPrintStandby.Top = (this.ClientSize.Height - pbFingerPrintStandby.Height) / 2;

            // 이름 및 인식 결과 문자
            lblStudentName.Left = (this.ClientSize.Width - lblStudentName.Width) / 2;
            lblStudentName.Top = (this.ClientSize.Height - lblStudentName.Height) / 2;
            lblStudentName.Visible = false;

            lblEnterance.Left = (this.ClientSize.Width - lblEnterance.Width) / 2;
            lblEnterance.Top = (this.ClientSize.Height - lblEnterance.Height) / 2 + lblEnterance.Height;
            lblEnterance.Visible = false;


            // 설정 버튼
            btnSetting.Left = 10;
            btnSetting.Top = this.ClientSize.Height - btnSetting.Height - 10;

            // 지문등록 버튼
            btnEnroll.Left = this.ClientSize.Width - btnEnroll.Width - 10;
            btnEnroll.Top = this.ClientSize.Height - btnSetting.Height - 10;


            btnClose.Visible = true;

            // 장치 시작 및 지문 인식 준비
            // 초기화
            InitFpEngine();

            LoadDBFromFile();

            OpenDevice();

            StartFpThread();
        }

        private void InitFpEngine()
        {
            m_UCBioAPI.GetInitInfo(out m_InitInfo0);
            m_InitInfo0.DefaultTimeout = 2000;
            m_UCBioAPI.SetInitInfo(m_InitInfo0);

            m_FastSearch.InitEngine();
        }

        private void StartFpThread()
        {
            GFunc.Info("StartFpThread");

            m_bStopFlag = false;
            Thread thread = new Thread(new ThreadStart(MyIndentifyThread));
            thread.Start();
        }

        private void StopFpThread()
        {
            m_bStopFlag = true;

            Thread.Sleep(2500);
        }

        private void MyIndentifyThread()
        {
            m_fpInfoList.Clear();

            uint dataCount;
            this.m_FastSearch.GetFpCount(out dataCount);

            UCBioAPI.FastSearch.FP_INFO _fpInfo;
            for (uint i = 0; i < dataCount; i++)
            {
                this.m_FastSearch.GetFpInfo(i, out _fpInfo);

                this.m_fpInfoList.Add(_fpInfo);
            }

            m_UCBioAPI.SetAutoDetect(1);

            uint ret = 0;

            long lastsendtime = 0;

            while (!m_bStopFlag)
            {
                try
                {
                    UCBioAPI.Type.HFIR CapturedFIR = new UCBioAPI.Type.HFIR();
                    ret = this.m_UCBioAPI.Capture(UCBioAPI.Type.FIR_PURPOSE.DENTIFY, out CapturedFIR, UCBioAPI.Type.TIMEOUT.INFINITE, null, winOption);
//                    ret = this.m_UCBioAPI.Capture(UCBioAPI.Type.FIR_PURPOSE.DENTIFY, out CapturedFIR, UNIONCOMM.SDK.UCBioBSP.UCBioAPI.Type.TIMEOUT.DEFAULT, null, winOption);
                    if (ret == UCBioAPI.Error.NONE)
                    {
                        UCBioAPI.Type.INPUT_FIR inputFIR = new UCBioAPI.Type.INPUT_FIR();
                        inputFIR.Form = UCBioAPI.Type.INPUT_FIR_FORM.HANDLE;
                        inputFIR.InputFIR.FIRinBSP = CapturedFIR;

                        UCBioAPI.FastSearch.FP_INFO fpInfo = new UCBioAPI.FastSearch.FP_INFO();
                        UCBioAPI.FastSearch.CALLBACK_INFO_0 callbackInfo0 = new UCBioAPI.FastSearch.CALLBACK_INFO_0();
                        UCBioAPI.FastSearch.FASTSEARCH_CALLBACK fastSearchCallback = new UCBioAPI.FastSearch.FASTSEARCH_CALLBACK(MyFastSearchCallBack);
                        callbackInfo0.CallBackFunction = fastSearchCallback;
                        callbackInfo0.UserCallBackParam = System.IntPtr.Zero;

                        Stopwatch stopWatch = new Stopwatch();
                        stopWatch.Start();
                        ret = this.m_FastSearch.Identify(inputFIR, 5, out fpInfo, callbackInfo0);
                        stopWatch.Stop();

                        if (ret != UCBioAPI.Error.NONE)
                        {
                            if (ret != UCBioAPI.Error.FASTSEARCH_IDENTIFY_STOP)
                            {
                                GFunc.Debug("Failed to identify fingerprint data from DB!");
                                SetResultText("인식실패", "", true);
                            }
                        }
                        else
                        {

                            long checktime = DateTime.Now.Ticks / 100000;
                            long elapsedtime = checktime - lastsendtime;

                            GFunc.Debug(string.Format("ELAPSED TIME - {0}", elapsedtime));

                            if (elapsedtime > 500)
                            {
                                // 3초 경과 하였다면

                                lastsendtime = DateTime.Now.Ticks / 100000;

                                GFunc.Debug(string.Format("FOUND - UserID:{0}, FP ID:{1}, Sample#:{2}", fpInfo.ID, fpInfo.FingerID, fpInfo.SampleNumber));
                                VerifyID(fpInfo.ID);
                            }
                            //else
                            //{
                            //    GFunc.Debug(string.Format("ELAPSED TIME - {0}", elapsedtime));
                            //}



                        }
                    }
                    if (ret == UCBioAPI.Error.CAPTURE_TIMEOUT)
                    {
                        GFunc.Debug("TimeOut");
                    }
                }
                catch (Exception ex)
                {
                    GFunc.Error(ex.ToString());
                }
            }

            GFunc.Info("StopFpThread");
        }


        uint MyFastSearchCallBack(ref UCBioAPI.FastSearch.CALLBACK_PARAM_0 pParam0, IntPtr pUserParam)
        {
            UCBioAPI.FastSearch.FP_INFO fpInfo = m_fpInfoList[(int)pParam0.MatchedIndex];

            GFunc.Debug(string.Format("Index:{0},UserID:{1}, FP ID:{2}, Sample#:{3}, Score:{4}",
                0, fpInfo.ID, fpInfo.FingerID, fpInfo.SampleNumber, pParam0.MatchedScore));

            return UNIONCOMM.SDK.UCBioBSP.UCBioAPI.FastSearch.CALLBACK_RETURN.OK;
        }

        private void btnSetting_Click(object sender, EventArgs e)
        {
            this.ActiveControl = btnDefault;

            SettingForm form = new SettingForm();
            form.Show();

        }

        private void btnEnroll_Click(object sender, EventArgs e)
        {
            this.ActiveControl = btnDefault;

            StopFpThread();

            CloseDevice();

            EnrollForm form = new EnrollForm();
            form.ShowDialog();

            ClearDB();

            LoadDBFromFile();

            OpenDevice();

            StartFpThread();
        }

        StringBuilder sbPasswrod = new StringBuilder();
        private void Form_KeyUp(object sender, KeyEventArgs e)
        {

            if (e.KeyCode == Keys.Enter)
            {
                string password = sbPasswrod.ToString();
                if (password.Equals("OPEN"))
                {
                    // btnClose.Visible = true;
                    btnSetting.Visible = true;
                    // btnEnroll.Visible = true;
                }
                else
                {
                    // btnClose.Visible = false;
                    btnSetting.Visible = false;
                    //btnEnroll.Visible = false;
                }

                sbPasswrod.Clear();
            }
            else
            {
                sbPasswrod.Append(e.KeyCode);
            }
        }

        private void LoadDBFromFile()
        {
            string filename = GFunc.GetDatabaseFullpath();
            uint ret = this.m_FastSearch.LoadDBFromFile(filename);
            if (ret != UCBioAPI.Error.NONE)
            {
                MessageBox.Show("지문 데이터베이스 파일이 없습니다. 생성하여 주시기 바랍니다.");
            }
        }
        private void ClearDB()
        {
            uint ret = this.m_FastSearch.ClearDB();
        }


        private void OpenDevice()
        {
            uint ret = this.m_UCBioAPI.OpenDevice(UCBioAPI.Type.DEVICE_ID.AUTO);
            if (ret != UCBioAPI.Error.NONE)
            {
                MessageBox.Show("지문 스캐너 장치를 열지 못했습니다.");
            }
        }

        public void CloseDevice()
        {
            uint ret = this.m_UCBioAPI.CloseDevice(UCBioAPI.Type.DEVICE_ID.AUTO);
            if (ret != UCBioAPI.Error.NONE)
            {
                MessageBox.Show("지문 스캐너 장치를 닫지 못했습니다.");
            }
        }


        delegate void SetResultTextInvokeRequired(string txt1, string txt2, bool error);
        private void SetResultText(string txt1, string txt2, bool error = false)
        {
            if (lblStudentName.InvokeRequired)
            {
                SetResultTextInvokeRequired invokeRequired = new SetResultTextInvokeRequired(SetResultText);
                this.Invoke(invokeRequired, new object[] { txt1, txt2, error });

            }
            else
            {
                pbFingerPrintStandby.Visible = false;

                lblStudentName.Visible = true;
                lblEnterance.Visible = true;

                lblStudentName.Text = txt1;
                if (error)
                    lblStudentName.ForeColor = Color.Red;
                else
                    lblStudentName.ForeColor = Color.White;

                lblEnterance.Text = txt2;



                // 에러
                if (error)
                {
                    //SoundPlayer snd = new SoundPlayer(Properties.Resources.error);
                    //snd.Play();
                    
                    dispTimer.Interval = 1500; // 1.5 sec

                }
                else
                {
                    SoundPlayer snd = new SoundPlayer(Properties.Resources.success);
                    snd.Play();

                    dispTimer.Interval = 1500; // 1.5 sec

                }

                // 타이머 생성 및 시작
                dispTimer.Tick += new EventHandler(timer_Tick);
                dispTimer.Start();
            }
        }

        // 아래 이벤트 핸들러 실행
        void timer_Tick(object sender, EventArgs e)
        {
            dispTimer.Stop();

            pbFingerPrintStandby.Visible = true;

            lblStudentName.Visible = false;
            lblEnterance.Visible = false;
        }

        void VerifyID(uint studentno)
        {
            // 요청
            HttpProcess httpProcess = new HttpProcess();

            JObject payload = new JObject();
            payload.Add("branchid", GFunc.GetBranchCode());
            payload.Add("memberno", studentno);

            httpProcess.post("/api/v1/verifyID", payload.ToString(), responseVerifyID);
        }

        private void responseVerifyID(string json)
        {
            JObject body = JObject.Parse(json);
            IDictionary<string, JToken> dictionary = body;

            int code = -1;
            if (dictionary.ContainsKey("code")) code = Convert.ToInt32(body.GetValue("code").ToString());

            if (code != 0)
            {
                if (code == 404)
                    SetResultText("학생정보없음", "", true);
                else
                    SetResultText("시스템오류", "", true);
                return;
            }
            else
            {
                string memberName = "";
                string enterance = "";

                if (body["data"]["membername"] != null) memberName = body["data"]["membername"].ToString();
                if (body["data"]["enterance"] != null) enterance = body["data"]["enterance"].ToString();


                SetResultText(memberName, enterance, false);
            }

        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Close();
        }
        
        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            StopFpThread();

            CloseDevice();
        }

    }
}
