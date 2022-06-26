using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

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
                this.showOnMonitor(0);

            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {

            
        }

        private void showOnMonitor(int showOnMonitor)
        {
            Screen[] sc;
            sc = Screen.AllScreens;

            this.Left = sc[showOnMonitor].Bounds.Left;
            this.Top = sc[showOnMonitor].Bounds.Top;
            this.StartPosition = FormStartPosition.Manual;
            this.WindowState = FormWindowState.Maximized;

        }
    }
}
