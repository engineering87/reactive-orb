// (c) 2024 Francesco Del Re <francesco.delre.87@gmail.com>
// This code is licensed under MIT license (see LICENSE.txt for details)
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WART_Core.Controllers;
using WART_Core.Hubs;

namespace ReactiveOrb.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReactiveOrbController : WartController
    {
        private readonly ILogger<ReactiveOrbController> _logger;

        public ReactiveOrbController(
            IHubContext<WartHub> messageHubContext, 
            ILogger<WartController> logger) : base(messageHubContext, logger)
        {

        }

        /// <summary>
        /// Crea una nuova risorsa e invia un evento POST.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateResource()
        {
            return Ok(new { message = "POST event sent successfully." });
        }

        /// <summary>
        /// Aggiorna una risorsa esistente e invia un evento PUT.
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateResource()
        {
            return Ok(new { message = "PUT event sent successfully." });
        }

        /// <summary>
        /// Recupera le informazioni della risorsa e invia un evento GET.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetResource()
        {
            return Ok(new { message = "GET event sent successfully." });
        }

        /// <summary>
        /// Elimina una risorsa e invia un evento DELETE.
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> DeleteResource()
        {
            return Ok(new { message = "DELETE event sent successfully." });
        }
    }
}
