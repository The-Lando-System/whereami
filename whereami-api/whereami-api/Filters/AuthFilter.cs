using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace whereami_api.Filters
{
    public class AuthFilter : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            string idToken = string.Empty;
            try
            {
                idToken = actionContext.Request.Headers.GetValues(Constants.IdTokenHeader)?.FirstOrDefault();
            }
            catch
            {
                return false;
            }

            if (string.IsNullOrEmpty(idToken)) return false;

            var authClient = new RestClient(Constants.TokenInfoUrl);
            var authRequest = new RestRequest(Method.POST);

            authRequest.AddParameter("id_token", idToken, ParameterType.QueryString);

            IRestResponse authResponse = authClient.Execute(authRequest);

            if (authResponse.StatusCode != HttpStatusCode.OK) return false;

            var authData = (JObject)JsonConvert.DeserializeObject(authResponse.Content);

            string email = authData["email"]?.Value<string>();

            if (string.IsNullOrEmpty(email)) return false;

            actionContext.Request.Headers.Add(Constants.UserEmailHeader, email);

            return true;
        }
    }
}