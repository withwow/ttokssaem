using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

using RestSharp;

using System.Threading;

using TtokFingerPrint.Utility;
using System.Net;

namespace TtokFingerPrint.Net
{
    class HttpProcess
    {

        public HttpProcess()
        {
        }


        public async void post(string api, string body, Action<string> callback)
        {
            string url = Globals.BaseUrl + api;
            var client = new RestClient();
            var request = new RestRequest(url, Method.Post);
            var cancellationTokenSource = new CancellationTokenSource();
           
            request.RequestFormat = DataFormat.Json;
            request.AddBody(body);

            GFunc.Debug("REQUEST:");
            GFunc.Debug(api);
            GFunc.Debug(body);


            var restResponse = await client.ExecuteAsync(request, cancellationTokenSource.Token);

            // Will output the HTML contents of the requested page
            GFunc.Debug("RESPONSE:" + restResponse.StatusCode );
            GFunc.Debug("DESC:" + restResponse.StatusDescription);

            GFunc.Debug(restResponse.Content);

            string data = "{}";
            if ( restResponse.StatusCode == HttpStatusCode.OK )
                data = restResponse.Content;

            callback(data);
        }

    }
}
