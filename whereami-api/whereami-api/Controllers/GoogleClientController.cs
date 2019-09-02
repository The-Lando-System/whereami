using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace whereami_api.Controllers
{
    [RoutePrefix("google")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class GoogleClientController : ApiController
    {
        [Route("client-id")]
        [HttpGet]
        public IHttpActionResult GetClientId()
        {
            string clientId = ConfigurationManager.AppSettings["GoogleClientId"];

            if (string.IsNullOrEmpty(clientId))
            {
                return InternalServerError(new Exception("Failed to get Google client ID. Perhaps GOOGLE_CLIENT_ID environment variable is not set?"));
            }

            return Ok(clientId);
        }

    }
}