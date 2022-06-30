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

using TtokFingerPrint.Net;
using TtokFingerPrint.Utility;

namespace TtokFingerPrint
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();

            // 멀티 스크린을 사용하는 User인 경우라면
            if (Screen.AllScreens.Count() > 1)
            {
                GFunc.showOnMonitor(this, GFunc.GetMonitorNo());
            }

            KeyPreview = true;
            KeyUp += Form_KeyUp;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // 로고
            pbLogo.Left = (this.ClientSize.Width - pbLogo.Width) / 2;
            //pbLogo.Top = (this.ClientSize.Height - pbLogo.Height * 2);
            pbLogo.Top = 50;

            // 스탠바이
            pbFingerPrintStandby.Left = (this.ClientSize.Width - pbFingerPrintStandby.Width) / 2;
            pbFingerPrintStandby.Top = (this.ClientSize.Height - pbFingerPrintStandby.Height) / 2;

            // 설정 버튼
            btnSetting.Left = 10;
            btnSetting.Top = this.ClientSize.Height - btnSetting.Height - 10;

            // 지문등록 버튼
            btnEnroll.Left = this.ClientSize.Width - btnEnroll.Width - 10;
            btnEnroll.Top = this.ClientSize.Height - btnSetting.Height - 10;

            // 

        }



        private void button1_Click(object sender, EventArgs e)
        {
            HttpProcess httpProcess = new HttpProcess();

            httpProcess.post("/api/v1/login", "{\"memberid\":\"member\", \"memberpw\":\"1\"}", Test);
        }

        private void Test(string content)
        {
            Debug.Write(content);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            HttpProcess httpProcess = new HttpProcess();

            httpProcess.ExecuteToken("/api/v1/authcheck", "{}", Test);

        }

        private void btnSetting_Click(object sender, EventArgs e)
        {
            SettingForm form = new SettingForm();
            form.Show();
        }

        private void btnEnroll_Click(object sender, EventArgs e)
        {
            EnrollForm form = new EnrollForm();
            form.ShowDialog();
        }

        StringBuilder sbPasswrod = new StringBuilder();
        private void Form_KeyUp(object sender, KeyEventArgs e)
        {

            if (e.KeyCode == Keys.Enter)
            {

                string password = sbPasswrod.ToString();
                if ( password.Equals("OPEN") ) {
                    btnSetting.Visible = true;
                    btnEnroll.Visible = true;
                }
                else
                {
                    btnSetting.Visible = false;
                    btnEnroll.Visible = false;
                }

                sbPasswrod.Clear();
            }
            else
            {
                sbPasswrod.Append(e.KeyCode);
            }


        }

    }
}
