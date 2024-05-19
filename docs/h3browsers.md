# Add HTTP/3 support to browsers

## Firefox

1. Go to *about:config*
2. *Accept the Risk and Continue.*
3. Search for *network.http.http3.alt-svc-mapping-for-testing*
4. Add *video.dev;h3=”:443”;h3-29=”:443”*

## Chrome

Open script with the following command:
```console
$ google-chrome --enable-quic --origin-to-force-quic-on=video.dev:443 main.html
```

[← Go Back](../README.md)