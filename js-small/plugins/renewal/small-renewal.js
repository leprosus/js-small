/*
 * JS-Small JavaScript Framework Plugin
 * Description: Plug-in checks version of user's browser and notices about out of date it
 * Copyright (c) 2008 - 2012 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * @author Denis Korolev
 * @version 0.0.1
 */
small.ready(function(){
    var l10n = {
        'en': 'Your browser is out of date. It has known security flaws and may not display all features of this and other websites.',
        'ru': 'Ваш браузер устарел. Он имеет уязвимости в безопасности и может не показывать все возможности на этом и других сайтах.',
        'de': 'Sie verwenden einen veralteten Browser mit Sicherheitsschwachstellen und k&ouml;nnen nicht alle Funktionen dieser Webseite nutzen.',
        'it': 'Il tuo browser non è aggiornato. Ha delle falle di sicurezza e potrebbe non visualizzare correttamente le pagine di questo e altri siti.',
        'pl': 'Przeglądarka ({1}), której używasz, jest przestarzała. Posiada ona udokumentowane luki bezpieczeństwa, inne wady oraz ograniczoną funkcjonalność. Tracisz możliwość skorzystania z pełni możliwości oferowanych przez niektóre strony internetowe.',
        'es': 'Tu navegador está desactualizado. Tiene conocidas fallas de seguridad y podría no mostrar todas las características de este y otros sitios web.',
        'nl': 'Uw browser is oud. Het heeft bekende veiligheidsissues en kan niet alle mogelijkheden weergeven van deze of andere websites.',
        'pt': 'Seu navegador está desatualizado. Ele possui falhas de segurança e pode apresentar problemas para exibir este e outros websites.',
        'sl': 'Vaš brskalnik je zastarel. Ima več varnostnih pomankljivosti in morda ne bo pravilno prikazal te ali drugih strani.',
        'id': 'Browser Anda (% s) sudah kedaluarsa. Browser yang Anda pakai memiliki kelemahan keamanan dan mungkin tidak dapat menampilkan semua fitur dari situs Web ini dan lainnya.',
        'uk': 'Ваш браузер застарів. Він уразливий й може не відображати всі можливості на цьому й інших сайтах.',
        'ko': '지금 사용하고 계신 브라우저({1})는 오래되었습니다. 알려진 보안 취약점이 존재하며, 새로운 웹 사이트가 깨져 보일 수도 있습니다.',
        'rm': 'Tes navigatur è antiquà. El cuntegna problems da segirezza enconuschents e mussa eventualmain betg tut las funcziuns da questa ed autras websites.',
        'ja': 'お使いのブラウザ「%s」は、時代遅れのバージョンです。既知の脆弱性が存在するばかりか、機能不足によって、サイトが正常に表示できない可能性があります。 <a href="{2}">ブラウザを更新する方法を確認する</a>',
        'fr': 'Votre navigateur est périmé. Il contient des failles de sécurité et pourrait ne pas afficher certaines fonctionalités des sites internet récents.',
        'da': 'Din browser er forældet. Den har kendte sikkerhedshuller og kan måske ikke vise alle funktioner på dette og andre websteder.',
        'al': 'Shfletuesi juaj është ca i vjetër. Ai ka të meta sigurie të njohura dhe mundet të mos i shfaqë të gjitha karakteristikat e kësaj dhe shumë faqeve web të tjera.',
        'ca': 'El teu navegador està desactualitzat. Té vulnerabilitats conegudes i pot no mostrar totes les característiques d\'aquest i altres llocs web.',
        'tr': 'Tarayıcınız güncel değildir.. Eski versiyon olduğu için güvenlik açıkları vardır ve görmek istediğiniz bu web sitesinin ve diğer web sitelerinin tüm özelliklerini hatasız bir şekilde gösteremeyecektir.',
        'fa': 'مرورگر شما از رده خارج شده می باشد. این مرورگر دارای مشکلات امنیتی شناخته شده می باشد و نمی تواند تمامی ویژگی های این وب سایت و دیگر وب سایت ها را به خوبی نمایش دهد.'
    },
    message = l10n[small.language()],
    list = {
        'chrome': {
            'title': 'Google Chrome',
            'link': 'http://google.com/chrome'
        },
        'firefox': {
            'title': 'Mozzila Firefox',
            'link': 'http://mozilla.com/firefox'
        },
        'safari': {
            'title': 'Safari',
            'link': 'http://apple.com/safari'
        },
        'opera': {
            'title': 'Opera',
            'link': 'http://opera.com/browser'
        },
        'msie': {
            'title': 'Internet Explorer',
            'link': 'http://windows.microsoft.com/ie'
        }
    },
    browser = small.browser(),
    version = parseInt(small.version().replace(/(\d+(?:\.\d+)?).*/, '$1'), 10),
    url = 'http://api.evalab.ru/browsers.php';
    small.json({
        'url': url,
        'callback': function(response){
            var lastVersion = response[browser] ? parseInt(response[browser]['version']) : Number.MAX_VALUE;
            if(lastVersion >= version){
                var renewal = small.body().append('div.renewal');
                renewal.append('div.message').text(message);

                var browsers = renewal.append('div.browsers');
                small.each(list, function(name, data){
                    browsers.append('a.' + name).attr({
                        'href': data.link,
                        'title': data.title,
                        'target': '_blank'
                    });
                });

                renewal.hover(open, close);

                function open(){
                    renewal.stop().start({
                        'time': 10,
                        'callback': function(){
                            var top = renewal.bound().top;
                            renewal.css('top', (top + 5) + 'px');
                            top >= 0 ? renewal.css('top', 0 + 'px') : open();
                        }
                    });
                }
                function close(){
                    renewal.stop().start({
                        'time': 10,
                        'callback': function(){
                            var top = renewal.bound().top;
                            renewal.css('top', (top - 5) + 'px');
                            top <= -60 ? renewal.css('top', -60 + 'px') : close();
                        }
                    });
                }
            }
        }
    });
});
