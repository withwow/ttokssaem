using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

using RestSharp;

using System.Threading;

using TtokFingerPrint.Utility;

namespace TtokFingerPrint.Net
{
    class HttpProcess
    {

        public HttpProcess()
        {
        }

        const string BaseUrl = "http://localhost:9502";

        public async void post(string api, string body, Action<string> callback)
        {
            string url = BaseUrl + api;
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
            GFunc.Debug("RESPONSE:");
            GFunc.Debug(restResponse.Content);
            
            callback(restResponse.Content);
        }

        public async void ExecuteToken(string api, string body, Action<string> callback)
        {
            var client = new RestClient();
            var request = new RestRequest(BaseUrl + api, Method.Post);
            var cancellationTokenSource = new CancellationTokenSource();

            request.RequestFormat = DataFormat.Json;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("accesstoken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJicmFuY2hpZCI6IkJSMDAwMDAwMDEiLCJtZW1iZXJpZCI6Im1lbWJlciIsImlhdCI6MTY1NjU1NzEzMiwiZXhwIjoxNjU2NjQzNTMyLCJpc3MiOiJpc3N1ZXIifQ.ArBPE-55oDqSEg1H3J-xnzd4cVnlucOr0Bc9267BrSQ");
            //request.AddParameter("application/json", body, ParameterType.RequestBody);
            request.AddBody(body);

            var restResponse = await client.ExecuteAsync(request, cancellationTokenSource.Token);

            // Will output the HTML contents of the requested page
            Console.WriteLine(restResponse.Content);
            callback(restResponse.Content);
        }

    }
}
