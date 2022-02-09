// const $ = require('jquery');
// export function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(';');
//     for(var i = 0; i <ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }

// var postIdTokenToSessionLogin = function(url, idToken, csrfToken) {
//     // POST to session login endpoint.
//     return $.ajax({
//     type:'POST',
//     url: url,
//     dataType:"json",
//     data: {idToken: idToken, csrfToken: csrfToken},
//     contentType: 'application/x-www-form-urlencoded',
//     xhrFields: {
//         withCredentials: true
//     },
//     crossDomain: true
//     });
// };