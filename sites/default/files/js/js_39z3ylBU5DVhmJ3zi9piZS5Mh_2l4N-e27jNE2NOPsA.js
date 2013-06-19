Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Ocorreu um erro HTTP no AJAX","HTTP Result Code: !status":"C\u00f3digo do Resultado HTTP:  !status","An AJAX HTTP request terminated abnormally.":"Uma requisi\u00e7\u00e3o HTTP AJAX terminou de forma anormal.","Debugging information follows.":"Estas s\u00e3o as informa\u00e7\u00f5es de depura\u00e7\u00e3o.","Path: !uri":"Caminho: !url","StatusText: !statusText":"Texto de Status: !statusText","ResponseText: !responseText":"Texto de Resposta: !responseText","ReadyState: !readyState":"ReadyState: !readyState","Loading":"Carregando","(active tab)":"(aba ativa)","Hide":"Ocultar","Show":"Exibir","Re-order rows by numerical weight instead of dragging.":"Re-ordernar as linhas por campos n\u00famericos de peso ao inv\u00e9s de arrastar-e-soltar.","Show row weights":"Exibir pesos das linhas","Hide row weights":"Ocultar pesos das linhas","Drag to re-order":"Arraste para reordenar","Changes made in this table will not be saved until the form is submitted.":"Mudan\u00e7as feitas nesta tabela n\u00e3o ser\u00e3o salvas at\u00e9 que o formul\u00e1rio seja enviado.","Remove":"Remover","Edit":"Editar","Default":"Padr\u00e3o","Add":"Adicionar","Configure":"Configurar","Done":"Conclu\u00eddo","Key":"Chave","Select all rows in this table":"Selecionar todas as linhas da tabela","Deselect all rows in this table":"Desmarcar todas as linhas da tabela","Not published":"N\u00e3o publicado","Please wait...":"Por favor, espere um pouco...","By @name on @date":"Por @name em @date","By @name":"Por @name","Not in menu":"Fora do menu","Alias: @alias":"URL Alternativa: @alias","No alias":"Nenhuma URL alternativa","New revision":"Nova revis\u00e3o","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"As altera\u00e7\u00f5es nesses blocos n\u00e3o v\u00e3o ser salvas enquanto o bot\u00e3o \u003Cem\u003ESalvar Blocos\u003C\/em\u003E n\u00e3o for clicado.","Show shortcuts":"Mostrar atalhos","No revision":"Sem revis\u00e3o","@number comments per page":"@number coment\u00e1rios por p\u00e1gina","Requires a title":"T\u00edtulo requerido","Not restricted":"Sem restri\u00e7\u00f5es","Not customizable":"N\u00e3o \u00e9 personaliz\u00e1vel","Restricted to certain pages":"Restrito para certas p\u00e1ginas","The block cannot be placed in this region.":"O bloco n\u00e3o pode ser colocado nessa regi\u00e3o.","Customize dashboard":"Personalizar painel","Hide summary":"Ocultar sum\u00e1rio","Edit summary":"Editar resumo","Don\u0027t display post information":"N\u00e3o exibir informa\u00e7\u00f5es de postagem","@title dialog":"Di\u00e1logo @title","The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.":"O arquivo selecionado %filename n\u00e3o p\u00f4de ser transferido. Somente arquivos com as seguintes extens\u00f5es s\u00e3o permitidos: %extensions.","Autocomplete popup":"Popup de autocompletar","Searching for matches...":"Procurando por dados correspondentes...","Hide shortcuts":"Esconder atalhos"}} };;
(function ($) {

$(document).ready(function() {

  // Expression to check for absolute internal links.
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

  // Attach onclick event to document only and catch clicks on all elements.
  $(document.body).click(function(event) {
    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      var ga = Drupal.settings.googleanalytics;
      // Expression to check for special links like gotwo.module /go/* links.
      var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
      // Expression to check for download links.
      var isDownload = new RegExp("\\.(" + ga.trackDownloadExtensions + ")$", "i");

      // Is the clicked URL internal?
      if (isInternal.test(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox')) {
          // Do nothing here. The custom event will handle all tracking.
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (ga.trackDownload && isDownload.test(this.href)) {
          // Download link clicked.
          var extension = isDownload.exec(this.href);
          _gaq.push(["_trackEvent", "Downloads", extension[1].toUpperCase(), this.href.replace(isInternal, '')]);
        }
        else if (isInternalSpecial.test(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          _gaq.push(["_trackPageview", this.href.replace(isInternal, '')]);
        }
      }
      else {
        if (ga.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          _gaq.push(["_trackEvent", "Mails", "Click", this.href.substring(7)]);
        }
        else if (ga.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (ga.trackDomainMode == 2 && isCrossDomain($(this).attr('hostname'), ga.trackCrossDomains)) {
            // Top-level cross domain clicked. document.location is handled by _link internally.
            event.preventDefault();
            _gaq.push(["_link", this.href]);
          }
          else {
            // External link clicked.
            _gaq.push(["_trackEvent", "Outbound links", "Click", this.href]);
          }
        }
      }
    });
  });

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  $(document).bind("cbox_complete", function() {
    var href = $.colorbox.element().attr("href");
    if (href) {
      _gaq.push(["_trackPageview", href.replace(isInternal, '')]);
    }
  });

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
function isCrossDomain(hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
}

})(jQuery);
;
