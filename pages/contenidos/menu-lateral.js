$(function(){
  var includes = $('[data-include]');
  jQuery.each(includes, function(){
    
    var file = $(this).data('include') + '.html';
    $(this).load(file, function (params) {
      links = $(document).find('.nav-ruta a');
      links.each(function () {
        if (document.location.pathname == '/index.html' || document.location.pathname == '/') {
          $(this).attr('href', 'pages/' + $(this).attr('href'));
        }else{
          $(this).attr('href', '../' + $(this).attr('href'));
        }

      });
      if ('usuario' in localStorage) {
        var USER = JSON.parse(localStorage.usuario);
        $('.nombre-usuario').html(USER.nombres);
      } else {
        if (document.location.pathname == '/index.html' || document.location.pathname == '/') {
          window.location.href = 'pages/login/login.html'; 
        }else{
          window.location.href = '../login/login.html'; 
        }
      }
    });
  });
});
