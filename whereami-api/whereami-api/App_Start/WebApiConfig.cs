using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace whereami_api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors();
            config.MapHttpAttributeRoutes();
        }
    }
}
