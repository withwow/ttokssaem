using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using TtokFingerPrint.Utility;

namespace TtokFingerPrint
{
    public partial class SettingForm : Form
    {
        public SettingForm()
        {
            InitializeComponent();

            // 멀티 스크린을 사용하는 User인 경우라면
            if (Screen.AllScreens.Count() > 1)
            {
                GFunc.showOnMonitor(this, GFunc.GetMonitorNo());
            }
        }

        private void SettingForm_Load(object sender, EventArgs e)
        {
            // Branch Code
            txtBranchCode.Left = (this.ClientSize.Width - txtBranchCode.Width) / 2;
            txtBranchCode.Top = (this.ClientSize.Height - txtBranchCode.Height) / 2 - txtBranchCode.Height - 10;

            // Monitor No
            txtMonitorNo.Left = (this.ClientSize.Width - txtMonitorNo.Width) / 2;
            txtMonitorNo.Top = (this.ClientSize.Height - txtMonitorNo.Height) / 2;

            // Gate
            txtGate.Left = (this.ClientSize.Width - txtGate.Width) / 2;
            txtGate.Top = (this.ClientSize.Height - txtGate.Height) / 2 + txtGate.Height + 10;

            // Close
            btnClose.Left = (this.ClientSize.Width - btnClose.Width) / 2;
            btnClose.Top = (this.ClientSize.Height - btnClose.Height) / 2 + btnClose.Height + 10 + btnClose.Height + 10;

            // 불러오기
            txtBranchCode.Text = GFunc.GetBranchCode();
            txtMonitorNo.Text = GFunc.GetMonitorNo().ToString();
            txtGate.Text = GFunc.GetGate().ToString();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            GFunc.SetBranchCode(txtBranchCode.Text);
            GFunc.SetMonitorNo(txtMonitorNo.Text);
            GFunc.SetGate(txtGate.Text);

            this.Close();
        }


    }
}
