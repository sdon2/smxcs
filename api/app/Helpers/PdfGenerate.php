<?php namespace Helpers;

class PdfGenerate
{
    public $pdf_url = 'http://127.0.0.1:5000/';

    function setPdfUrl(string $url) {
        $this->pdf_url = $url;
    }

    function generatePdf($html, $orientation = "LANDSCAPE", $pagesize = "A4", $width = "0.00", $height = "0.00") {

        $ch = \curl_init($this->pdf_url);
        $payload = $html;

        # Setup request to send json via POST.
        \curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        \curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:text/html', 'Orientation:'.$orientation, 'PageSize:'.$pagesize, 'Width:'.$width, 'Height:'.$height));
        # Return response instead of printing.
        \curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        \curl_setopt($ch, CURLOPT_HEADER, true);

        $headers = [];

        # Get headers
        \curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$headers) {
            $len = \strlen($header);
            $header = \explode(':', $header, 2);
            if (\count($header) >= 2)
                $headers[\trim($header[0])] = \trim($header[1]);
            return $len;
        });

        # Send request.
        $result = \curl_exec($ch);

        // Remove headers from body
        $header_len = \curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $body = \substr($result, $header_len);

        if(\curl_error($ch)) {
            $body = 'Error:' . curl_error($ch);
        }
        else {
            foreach ($headers as $h_name => $header) {
                \header("$h_name: $header");
            }
        }
        \curl_close($ch);

        echo $body;
    }
}
