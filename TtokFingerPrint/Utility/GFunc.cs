using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TtokFingerPrint.Utility;

using log4net;
using log4net.Config;
using System.Resources;
using System.Reflection;
using System.Windows.Forms;
using System.IO;

namespace TtokFingerPrint.Utility
{
    public static class GFunc
    {
        private static readonly ILog logger = LogManager.GetLogger("TtokFingerPrint");

        /*
         * 초기화
         */
        public static void Init()
        {
            XmlConfigurator.Configure(new System.IO.FileInfo("log4net.xml"));

            GetBranchCode();
            GetMonitorNo();
            GetGate();
        }

        /*
         * 내문서 폴더
         */
        public static string GetMyDocumentsFolder()
        {
            return Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        }

        public static bool IsBranchCode()
        {
            string branchcode = GetBranchCode();
            if (branchcode.Equals(""))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public static string GetDatabaseFullpath()
        {
            string fullPath = Path.Combine(GFunc.GetMyDocumentsFolder(), "TTOK_FP");
            bool exists = System.IO.Directory.Exists(fullPath);
            if (!exists)
                System.IO.Directory.CreateDirectory(fullPath);

            string branchcode = GetBranchCode();
            fullPath = Path.Combine(fullPath, branchcode + ".UFS");
            return fullPath;
        }

        /*
         * 리소스 문자열
         */
        public static string GetString(string resourceId)
        {
            ResourceManager rm = new ResourceManager("TtokFingerPrint.Properties.Resources", Assembly.GetExecutingAssembly());
            return rm.GetString(resourceId);
        }

        /*
         * 메시지 박스
         */
        public static void MessageBox(string resourceId)
        {
            MessageBox("default_title", resourceId);
        }

        public static bool ConfirmBox(string resourceId)
        {
            return ConfirmBox("default_title", resourceId);
        }

        public static void MessageBox(string titleid, string resourceId)
        {
            if (GetString(resourceId) == null)
                System.Windows.Forms.MessageBox.Show(resourceId, GetString(titleid));
            else
                System.Windows.Forms.MessageBox.Show(GetString(resourceId), GetString(titleid));
        }

        public static bool ConfirmBox(string titleid, string resourceId)
        {
            if (GetString(resourceId) == null)
                if (System.Windows.Forms.MessageBox.Show(resourceId, GetString(titleid), MessageBoxButtons.YesNo) == DialogResult.Yes) return true;
                else
                if (System.Windows.Forms.MessageBox.Show(GetString(resourceId), GetString(titleid), MessageBoxButtons.YesNo) == DialogResult.Yes) return true;

            return false;
        }

        /*
         * 로거
         */
        public static void Debug(string msg)
        {
            logger.Debug(msg);
        }

        public static void Info(string msg)
        {
            logger.Info(msg);
        }

        public static void Error(string msg)
        {
            logger.Error(msg);
        }

        /*
         * 로그인 창
         */
        public static string GetBranchCode()
        {
            return ReadRegistry("BranchCode");
        }

        public static void SetBranchCode(string value)
        {
            WriteRegistry("BranchCode", value);
        }

        public static int GetMonitorNo()
        {
            return Convert.ToInt32(ReadRegistry("MonitorNo"));
        }

        public static void SetMonitorNo(string value)
        {
            WriteRegistry("MonitorNo", value);
        }

        public static string GetGate()
        {
            return ReadRegistry("Gate");
        }

        public static void SetGate(string value)
        {
            WriteRegistry("Gate", value);
        }

        /*
         * 레지스트리
         */
        public static string ReadRegistry(string key)
        {
            ModifyRegistry myRegistry = new ModifyRegistry();
            return myRegistry.Read(key);
        }

        public static void WriteRegistry(string key, string value)
        {
            ModifyRegistry myRegistry = new ModifyRegistry();
            myRegistry.Write(key, value);
        }

        /*
         * 스크린
         */
        public static void showOnMonitor(Form form, int showOnMonitor)
        {
            Screen[] sc;
            sc = Screen.AllScreens;

            form.Left = sc[showOnMonitor].Bounds.Left;
            form.Top = sc[showOnMonitor].Bounds.Top;
            form.StartPosition = FormStartPosition.Manual;
            //this.FormBorderStyle = FormBorderStyle.None;
            form.WindowState = FormWindowState.Maximized;
        }

        public static void showOnMonitorCenter(Form form, int showOnMonitor)
        {
            Screen[] sc;
            sc = Screen.AllScreens;

            form.Left = sc[showOnMonitor].Bounds.Left;
            form.Top = sc[showOnMonitor].Bounds.Top;
            form.StartPosition = FormStartPosition.Manual;
            form.WindowState = FormWindowState.Normal;
        }
    }
}
