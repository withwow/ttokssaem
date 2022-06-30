using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using UNIONCOMM.SDK.UCBioBSP;
using System.Threading;
using System.Diagnostics;

using TtokFingerPrint.Utility;
using TtokFingerPrint.Net;

using Newtonsoft.Json.Linq;

namespace TtokFingerPrint
{
    public partial class EnrollForm : Form
    {
        UCBioAPI m_UCBioAPI;
        UCBioAPI.FastSearch m_FastSearch;

        UCBioAPI.Type.INIT_INFO_0 m_InitInfo0;

        bool m_bStopFlag = false;
        bool m_bIsDirty = true;
        List<UCBioAPI.FastSearch.FP_INFO> m_fpInfoList = new List<UCBioAPI.FastSearch.FP_INFO>();
        int m_nSearchCount = 0;

        public EnrollForm()
        {
            InitializeComponent();

            // 멀티 스크린을 사용하는 User인 경우라면
            if (Screen.AllScreens.Count() > 1)
            {
                GFunc.showOnMonitorCenter(this, 1);
            }

            m_UCBioAPI = new UCBioAPI();
            m_FastSearch = new UCBioAPI.FastSearch(m_UCBioAPI);

       }

        private void EnrollForm_Load(object sender, EventArgs e)
        {
            // 버전 표시
            UCBioAPI.Type.VERSION version = new UCBioAPI.Type.VERSION();
            m_UCBioAPI.GetVersion(out version);
            Text = String.Format("FastSearch (BSP:v{0}.{1}.{2}.{3})", version.Major1, version.Major2, version.Minor1, version.Minor2);

            // 초기화
            m_UCBioAPI.GetInitInfo(out m_InitInfo0);
            m_FastSearch.InitEngine();

            // 상태바 
            SetStatusText("Ready");
            SetIndentifyStatus("Ready");
        }

        delegate void SetStatusTextInvokeRequired(string txt);
        private void SetStatusText(string txt)
        {
            if (lblStatus.InvokeRequired)
            {
                SetStatusTextInvokeRequired invokeRequired = new SetStatusTextInvokeRequired(SetStatusText);
                this.Invoke(invokeRequired, new object[] { txt });

            }
            else
            {
                lblStatus.Text = txt;
            }
        }

        delegate void SetIndentifyStatusTextInvokeRequired(string txt);
        private void SetIndentifyStatus(string txt)
        {
            if (lblIdentifyStatus.InvokeRequired)
            {
                SetIndentifyStatusTextInvokeRequired invokeRequired = new SetIndentifyStatusTextInvokeRequired(SetIndentifyStatus);
                this.Invoke(invokeRequired, new object[] { txt });

            }
            else
            {
                lblIdentifyStatus.Text = txt;
            }
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            m_bStopFlag = false;
            this.Close();
        }

        private void btnEnroll_Click(object sender, EventArgs e)
        {
            short iDeviceID = UCBioAPI.Type.DEVICE_ID.AUTO;

            uint ret = m_UCBioAPI.OpenDevice(iDeviceID);
            if (ret != UCBioAPI.Error.NONE)
            {
                SetStatusText("Failed to open device");
                return;
            }

            UCBioAPI.Type.HFIR hNewFIR;
            ret = this.m_UCBioAPI.Enroll(null, out hNewFIR, null, UCBioAPI.Type.TIMEOUT.DEFAULT, null, null);
            if (ret == UCBioAPI.Error.NONE)
            {
                UCBioAPI.Type.INPUT_FIR inputFIR = new UCBioAPI.Type.INPUT_FIR();
                inputFIR.Form = UCBioAPI.Type.INPUT_FIR_FORM.HANDLE;
                inputFIR.InputFIR.FIRinBSP = hNewFIR;

                UCBioAPI.FastSearch.FP_INFO[] SampleInfo;
                this.m_FastSearch.AddFIR(inputFIR, Convert.ToUInt32(txtUserID.Text), out SampleInfo);
                if (ret == UCBioAPI.Error.NONE)
                {
                    for (int i = 0; i < SampleInfo.Length; i++)
                    {
                        ListViewItem item = new ListViewItem(SampleInfo[i].ID.ToString());
                        item.SubItems.Add(SampleInfo[i].FingerID.ToString());
                        item.SubItems.Add(SampleInfo[i].SampleNumber.ToString());
                        lsvUser.Items.Add(item);
                    }
                    m_bIsDirty = true;
                    SetStatusText("Successfully added to DB");
                }
                else
                {
                    SetStatusText("Failed to add fingerprint data to DB!");
                }
                txtUserID.Text = Convert.ToString(int.Parse(txtUserID.Text) + 1);
            }
            this.m_UCBioAPI.CloseDevice(iDeviceID);
            lblTotalCount.Text = string.Format("Total data count: {0}", lsvUser.Items.Count);
        }


        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            this.m_FastSearch.ClearDB();
        }

        private void btnLoadDB_Click(object sender, EventArgs e)
        {
            if (lsvUser.Items.Count > 0)
            {
                if (MessageBox.Show("If you load database from file, existing memory database will be cleared!\nAre you sure you want to load database?", "",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.No)
                    return;
            }

            OpenFileDialog openFileDlg = new OpenFileDialog();
            openFileDlg.Filter = "UnionFastSearch DB(*.UFS)|*.UFS|All file(*.*)|*.*";
            if (openFileDlg.ShowDialog() == DialogResult.OK)
            {
                btnClearDB.PerformClick();
                lsvUser.Items.Clear();

                uint ret = this.m_FastSearch.LoadDBFromFile(openFileDlg.FileName);
                if (ret == UCBioAPI.Error.NONE)
                {
                    uint dataCount;
                    this.m_FastSearch.GetFpCount(out dataCount);
                    pgbUser.Maximum = (int)dataCount - 1;
                    pgbUser.Value = 0;

                    UCBioAPI.FastSearch.FP_INFO fpInfo;
                    for (uint i = 0; i < dataCount; i++)
                    {
                        this.m_FastSearch.GetFpInfo(i, out fpInfo);

                        ListViewItem item = new ListViewItem(fpInfo.ID.ToString());
                        item.SubItems.Add(fpInfo.FingerID.ToString());
                        item.SubItems.Add(fpInfo.SampleNumber.ToString());
                        lsvUser.Items.Add(item);
                        pgbUser.Value = (int)i;
                    }
                    m_bIsDirty = true;
                    SetStatusText("Successfully loaded from file");
                }
                else
                    SetStatusText(string.Format("Failed to load database from file (Error : {0})", ret));
            }
            lblTotalCount.Text = string.Format("Total data count: {0}", lsvUser.Items.Count);

        }

        private void btnSaveDB_Click(object sender, EventArgs e)
        {
            SaveFileDialog saveFileDlg = new SaveFileDialog();
            saveFileDlg.Filter = "UnionFastSearch DB(*.UFS)|*.UFS|All file(*.*)|*.*";
            if (saveFileDlg.ShowDialog() == DialogResult.OK)
            {
                this.m_FastSearch.SaveDBToFile(saveFileDlg.FileName);
                SetStatusText("Successfully saved to file!");
            }

        }

        private void btnDeleteData_Click(object sender, EventArgs e)
        {
            UCBioAPI.FastSearch.FP_INFO fpInfo = new UCBioAPI.FastSearch.FP_INFO();
            fpInfo.ID = Convert.ToUInt32(lsvUser.SelectedItems[0].SubItems[0].Text);
            fpInfo.FingerID = Convert.ToByte(lsvUser.SelectedItems[0].SubItems[1].Text);
            fpInfo.SampleNumber = Convert.ToByte(lsvUser.SelectedItems[0].SubItems[2].Text);
            this.m_FastSearch.RemoveFp(fpInfo);
            lsvUser.Items.RemoveAt(lsvUser.SelectedIndices[0]);

            m_bIsDirty = true;
            lblTotalCount.Text = string.Format("Total data count: {0}", lsvUser.Items.Count);
        }

        private void btnClearDB_Click(object sender, EventArgs e)
        {
            this.m_FastSearch.ClearDB();
            lsvUser.Items.Clear();
            m_bIsDirty = true;

        }

        private void btnIdentify_Click(object sender, EventArgs e)
        {
            uint fpCount;
            this.m_FastSearch.GetFpCount(out fpCount);
            pgbIdentify.Maximum = (int)fpCount;
            pgbIdentify.Value = 0;
            m_bStopFlag = false;
            Thread thread = new Thread(new ThreadStart(MyIndentifyThread));
            thread.Start();
            btnIdentify.Enabled = false;
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            btnIdentify.Enabled = true;
        }



        private void MyIndentifyThread()
        {
            if (m_bIsDirty)
            {
                m_fpInfoList.Clear();
                AddFPInfoList();
                m_bIsDirty = false;
            }

            m_UCBioAPI.SetAutoDetect(1);

            uint ret = this.m_UCBioAPI.OpenDevice(UCBioAPI.Type.DEVICE_ID.AUTO);
            if (ret != UCBioAPI.Error.NONE)
            {
                SetStatusText("Failed to open device!");
            }
            else
            {
                try
                {
                    UCBioAPI.Type.HFIR CapturedFIR = new UCBioAPI.Type.HFIR();
                    ret = this.m_UCBioAPI.Capture(UCBioAPI.Type.FIR_PURPOSE.DENTIFY, out CapturedFIR, UNIONCOMM.SDK.UCBioBSP.UCBioAPI.Type.TIMEOUT.INFINITE, null, null);
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

                        this.m_nSearchCount = 0;
                        Stopwatch stopWatch = new Stopwatch();
                        stopWatch.Start();
                        ret = this.m_FastSearch.Identify(inputFIR, 5, out fpInfo, callbackInfo0);
                        stopWatch.Stop();
                        //lblIdentifyTime.Text = string.Format("{0}", stopWatch.Elapsed);
                        //lsvResult.Items.Clear();

                        this.Invoke(new MethodInvoker(delegate ()
                        {
                            lblIdentifyTime.Text = string.Format("{0}", stopWatch.Elapsed);
                            lsvResult.Items.Clear();

                        }));


                        if (ret != UCBioAPI.Error.NONE)
                        {
                            if (ret != UCBioAPI.Error.FASTSEARCH_IDENTIFY_STOP)
                            {
                                SetStatusText("Failed to identify fingerprint data from DB!");
                                SetIndentifyStatus("Not found");
                            }
                        }
                        else
                        {
                            AddResultListView(fpInfo);
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.ToString());
                }
                finally
                {
                    this.m_UCBioAPI.CloseDevice(UCBioAPI.Type.DEVICE_ID.AUTO);
                }
            }
            this.Invoke(new MethodInvoker(delegate () { btnIdentify.Enabled = true; }));

        }


        uint MyFastSearchCallBack(ref UCBioAPI.FastSearch.CALLBACK_PARAM_0 pParam0, IntPtr pUserParam)
        {
            UCBioAPI.FastSearch.FP_INFO fpInfo = m_fpInfoList[(int)pParam0.MatchedIndex];

            //this.Invoke(new MethodInvoker(() => { pgbIdentify.Value = ++m_nSearchCount; })); //fw 3.0
            //pgbIdentify.Value = ++m_nSearchCount;
            UpdatepgbIdentify();
            SetIndentifyStatus(string.Format("Index:{0},UserID:{1}, FP ID:{2}, Sample#:{3}, Score:{4}",
                m_nSearchCount, fpInfo.ID, fpInfo.FingerID, fpInfo.SampleNumber, pParam0.MatchedScore));

            if (m_bStopFlag)
                return UNIONCOMM.SDK.UCBioBSP.UCBioAPI.FastSearch.CALLBACK_RETURN.STOP;
            else
                return UNIONCOMM.SDK.UCBioBSP.UCBioAPI.FastSearch.CALLBACK_RETURN.OK;
        }

        delegate void UpdatepgbIdentifyInvokeRequired();
        private void UpdatepgbIdentify()
        {
            if (lsvUser.InvokeRequired)
            {
                UpdatepgbIdentifyInvokeRequired invokeRequired = new UpdatepgbIdentifyInvokeRequired(UpdatepgbIdentify);
                this.Invoke(invokeRequired, new object[] { });
            }
            else
            {
                pgbIdentify.Value = ++m_nSearchCount;

            }
        }

        delegate void AddFPInfoListInvokeRequired();
        private void AddFPInfoList()
        {
            if (lsvUser.InvokeRequired)
            {
                AddFPInfoListInvokeRequired invokeRequired = new AddFPInfoListInvokeRequired(AddFPInfoList);
                this.Invoke(invokeRequired, new object[] { });
            }
            else
            {
                foreach (ListViewItem item in lsvUser.Items)
                {
                    UCBioAPI.FastSearch.FP_INFO fpInfo = new UCBioAPI.FastSearch.FP_INFO();
                    fpInfo.ID = Convert.ToUInt32(item.SubItems[0].Text);
                    fpInfo.FingerID = Convert.ToByte(item.SubItems[1].Text);
                    fpInfo.SampleNumber = Convert.ToByte(item.SubItems[2].Text);
                    this.m_fpInfoList.Add(fpInfo);
                }
            }
        }

        delegate void AddResultListViewInvokeRequired(UCBioAPI.FastSearch.FP_INFO fpInfo);
        private void AddResultListView(UCBioAPI.FastSearch.FP_INFO fpInfo)
        {
            if (lsvResult.InvokeRequired)
            {
                AddResultListViewInvokeRequired invokeRequired = new AddResultListViewInvokeRequired(AddResultListView);
                this.Invoke(invokeRequired, new object[] { fpInfo });
            }
            else
            {
                ListViewItem item = new ListViewItem(fpInfo.ID.ToString());
                item.SubItems.Add(fpInfo.FingerID.ToString());
                item.SubItems.Add(fpInfo.SampleNumber.ToString());
                lsvResult.Items.Add(item);
            }
        }

        private void btnQurey_Click(object sender, EventArgs e)
        {
            HttpProcess httpProcess = new HttpProcess();

            JObject payload = new JObject();
            payload.Add("membername", txtMemberName.Text);

            httpProcess.post("/api/v1/searchStudent", payload.ToString(), Search);
        }

        private void Search(string json)
        {
            JObject body = JObject.Parse(json);
            IDictionary<string, JToken> dictionary = body;

            int code = -1;
            if (dictionary.ContainsKey("code")) code = Convert.ToInt32(body.GetValue("code").ToString());

            if( code != 0)
            {
                SetStatusText(string.Format("ERROR {0}", code));
                return;
            } 
            else
            {
                SetStatusText(string.Format("SUCCESS {0}", code));
            }

            if (dictionary.ContainsKey("data"))
            {
                string memberNo = "";
                string schoolName = "";
                string grade = "";

                foreach (JToken item in body["data"])
                {
                    if (item["memberno"] != null) memberNo = item["memberno"].ToString();
                    if (item["schoolname"] != null) schoolName = item["schoolname"].ToString();
                    if (item["grade"] != null) grade = item["grade"].ToString();
                }

                txtUserID.Text = memberNo;
                lblSchoolName.Text = schoolName;
                lblGrade.Text = grade;
            }
        }
    }
}
