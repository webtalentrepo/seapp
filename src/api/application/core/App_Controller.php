<?php

/**
 * Created by PhpStorm.
 * User: My
 * Date: 4/7/2016
 * Time: 1:42 AM
 */
abstract class App_Controller extends CI_Controller
{
    private $requestPayloadParams = array();

    public function __construct()
    {
        parent::__construct();

        $this->init();
    }

    private function init()
    {
        date_default_timezone_set($this->config->item('default_timezone'));
        $this->requestPayloadParams = json_decode(file_get_contents('php://input'), true);
    }

    protected function getRequestPayloadParameter($name, $defaultValue = null)
    {
        return isset($this->requestPayloadParams[$name]) ? $this->requestPayloadParams[$name] : $defaultValue;
    }

    protected function getRequestPayloadParameters()
    {
        return $this->requestPayloadParams;
    }

    protected function setHttpStatus($code = 200)
    {
        if (function_exists('http_response_code')) {
            http_response_code($code);
        } else {
            switch ($code) {
                case 100:
                    $text = 'Continue';
                    break;
                case 101:
                    $text = 'Switching Protocols';
                    break;
                case 200:
                    $text = 'OK';
                    break;
                case 201:
                    $text = 'Created';
                    break;
                case 202:
                    $text = 'Accepted';
                    break;
                case 203:
                    $text = 'Non-Authoritative Information';
                    break;
                case 204:
                    $text = 'No Content';
                    break;
                case 205:
                    $text = 'Reset Content';
                    break;
                case 206:
                    $text = 'Partial Content';
                    break;
                case 300:
                    $text = 'Multiple Choices';
                    break;
                case 301:
                    $text = 'Moved Permanently';
                    break;
                case 302:
                    $text = 'Moved Temporarily';
                    break;
                case 303:
                    $text = 'See Other';
                    break;
                case 304:
                    $text = 'Not Modified';
                    break;
                case 305:
                    $text = 'Use Proxy';
                    break;
                case 400:
                    $text = 'Bad Request';
                    break;
                case 401:
                    $text = 'Unauthorized';
                    break;
                case 402:
                    $text = 'Payment Required';
                    break;
                case 403:
                    $text = 'Forbidden';
                    break;
                case 404:
                    $text = 'Not Found';
                    break;
                case 405:
                    $text = 'Method Not Allowed';
                    break;
                case 406:
                    $text = 'Not Acceptable';
                    break;
                case 407:
                    $text = 'Proxy Authentication Required';
                    break;
                case 408:
                    $text = 'Request Time-out';
                    break;
                case 409:
                    $text = 'Conflict';
                    break;
                case 410:
                    $text = 'Gone';
                    break;
                case 411:
                    $text = 'Length Required';
                    break;
                case 412:
                    $text = 'Precondition Failed';
                    break;
                case 413:
                    $text = 'Request Entity Too Large';
                    break;
                case 414:
                    $text = 'Request-URI Too Large';
                    break;
                case 415:
                    $text = 'Unsupported Media Type';
                    break;
                case 500:
                    $text = 'Internal Server Error';
                    break;
                case 501:
                    $text = 'Not Implemented';
                    break;
                case 502:
                    $text = 'Bad Gateway';
                    break;
                case 503:
                    $text = 'Service Unavailable';
                    break;
                case 504:
                    $text = 'Gateway Time-out';
                    break;
                case 505:
                    $text = 'HTTP Version not supported';
                    break;
                default:
                    exit('Unknown http status code "' . htmlentities($code) . '"');
                    break;
            }

            $protocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0';

            header($protocol . ' ' . $code . ' ' . $text);
        }
    }

    protected function sendJsonResponse($data, $code = null)
    {
        $this->sendResponse(null === $data ? null : json_encode($data), $code, array('Content-Type' => 'application/json'));
    }

    protected function sendResponse($data, $code = null, $headers = array())
    {
        if (null === $data && null === $code) {
            $code = 404;
        } else if (null === $code) {
            $code = 200;
        }

        $this->setHttpStatus($code);

        foreach ($headers as $key => $value) {
            header($key . ': ' . $value);
        }

        echo $data;
        $this->terminate(0);
    }

    protected function terminate($code = 0)
    {
        exit($code);
    }
}