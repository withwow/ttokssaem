using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TtokFingerPrint
{
    class Globals
    {
#if true
        public const string BaseUrl = "https://api.ttokssaem.com";
#else
        public const string BaseUrl = "http://localhost:9502";
#endif

        public const string FtpHost = "ttokssaem.cafe24.com";
        public const string FtpUser = "ubuntu";
        public const string FtpPwd = "Daebak2022!%";
        public const string FtpRemoteDir = "/data/finger_print";

    }
}
