<?php

class Browsers {
    private $namesList
        = array(
            'chrome' => 'Google Chrome',
            'firefox' => 'Mozzila Firefox',
            'safari' => 'Safari',
            'opera' => 'Opera',
            'msie' => 'Internet Explorer'
        );
    private $urlList
        = array(
            'chrome' => 'http://en.wikipedia.org/wiki/Google_Chrome',
            'firefox' => 'http://en.wikipedia.org/wiki/Firefox',
            'safari' => 'http://en.wikipedia.org/wiki/Safari_(web_browser)',
            'opera' => 'http://en.wikipedia.org/wiki/Opera_(web_browser)',
            'msie' => 'http://en.wikipedia.org/wiki/Internet_Explorer'
        );
    private $token = 'Latest_stable_software_release/%s';
    private $tokensList
        = array(
            'chrome' => 'Google_Chrome',
            'firefox' => 'Firefox',
            'safari' => 'Safari',
            'opera' => 'Opera',
            'msie' => 'Internet_Explorer'
        );
    private $versionRegExp = '#(\d+(?:\.\d+)?).*#iu';
    private $encoding = 'UTF-8';
    private $hashRegExp = '#^[a-z]+$#i';
    private $cacheFile = 'browsers.cache';
    private $cacheTime = 86400; // 24 hours

    function __construct() {
        if(!file_exists($this->cacheFile) || filemtime($this->cacheFile) - mktime() > $this->cacheTime) {
            $data = array();

            foreach($this->namesList as $name => $title) {
                $url = $this->urlList[$name];
                $content = $this->getUrlContent($url);
                $token = sprintf($this->token, $this->tokensList[$name]);

                if(preg_match('#<[a-z]{1,6}>((?:\d+\.?)+).*'.$token.'#u', $content, $matches)) {
                    $version = preg_replace($this->versionRegExp, '\\1', $matches[1]);

                    $data[$name] = array(
                        'name' => $title,
                        'version' => $version
                    );
                }
            }

            $json = json_encode($data);

            file_put_contents($this->cacheFile, $json);
        } else {
            $json = file_get_contents($this->cacheFile);
        }

        $callback = isset($_GET['callback']) && preg_match($this->hashRegExp, $_GET['callback']) ? $_GET['callback'] : null;

        header('Content-type: text/javascript; charset='.$this->encoding);
        echo is_null($callback) ? $json : $callback.'('.$json.')';
    }

    private function getUrlContent($url, $timeout = 5, $post = array()) {
        $cookie = tempnam('/tmp', 'CURLCOOKIE');
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1");
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_ENCODING, "");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_AUTOREFERER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
        curl_setopt($curl, CURLOPT_USERAGENT, 'Opera 17.00');

        if(count($post) > 0) {
            curl_setopt($curl, CURLOPT_POST, 1);

            foreach($post as $name => &$value) {
                $value = $name.'='.urlencode($value);
            }

            curl_setopt($curl, CURLOPT_POST, count($post));
            curl_setopt($curl, CURLOPT_POSTFIELDS, implode('&', $post));
        }

        $content = curl_exec($curl);
        curl_close($curl);

        return $content;
    }
}

new Browsers();
?>