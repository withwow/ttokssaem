using Renci.SshNet;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;

using TtokFingerPrint.Utility;

namespace TtokFingerPrint
{
    public partial class LoadForm : Form
    {
        public LoadForm()
        {
            InitializeComponent();

            CenterToScreen();
        }

        private void LoadForm_Load(object sender, EventArgs e)
        {
            bool error = DownloadDatabseFiel();
            if( !error)
            {
                this.Hide();
                MainForm mainForm = new MainForm();
                mainForm.ShowDialog();
                this.Close();
            }
        }

        private bool DownloadDatabseFiel()
        {
            bool error = false;
            try
            {
                // SFTP 전송
                var localDir = GFunc.GetDatabaseFullpath();
                var remoteDir = GFunc.GetRemoteFullpath();

                var ci = new ConnectionInfo(Globals.FtpHost, Globals.FtpUser, new PasswordAuthenticationMethod(Globals.FtpUser, Globals.FtpPwd));
                using (var sftp = new SftpClient(ci))
                {
                    // SFTP 서버 연결
                    sftp.Connect();

                    // SFTP 업로드
                    using (var file = File.OpenWrite(localDir))
                    {
                        sftp.DownloadFile(remoteDir, file);
                    }

                    // SFTP 서버 해제
                    sftp.Disconnect();
                }
            }
            catch (Exception ex)
            {
                error = true;
                MessageBox.Show(ex.Message);
            }
            finally
            {
                
            }

            return error;
        }
    }
}
