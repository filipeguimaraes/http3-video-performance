# Install and configure NGINX with QUIC (beta) and RTMP module 

## Dependencies


```console
$ sudo apt install mercurial libmaxminddb0 libmaxminddb-dev mmdb-bin geoipupdate libgeoip-dev libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev liblz-dev libgd-dev libxml2 libxml2-dev uuid-dev
```

## Clone nginx-quic and modules

1. Clone nginx-quic
    ```console
    $ hg clone -b quic https://hg.nginx.org/nginx-quic

    $ cd ngnix-quic/
    ```

2. Clone RTMP module

    ```console
    $ git clone https://github.com/arut/nginx-rtmp-module.git
    ```
3. Clone BorringSSL to replace openSSL
    ```console
    $ git clone https://github.com/google/boringssl.git

    $ cd boringssl

    $ mkdir build && cd build && cmake -DCMAKE_BUILD_TYPE=Release ../ && make crypto ssl

    $ cd ..

    $ mkdir -p .openssl/lib && cd .openssl && ln -s ../include . && cd ../

    $ cp build/crypto/libcrypto.a build/ssl/libssl.a .openssl/lib && cd ..
    ```

## NGINX configuration and installation 
    
```console
$ cd nginx-quic

$ sudo ./auto/configure \
--prefix=/etc/nginx \
--conf-path=/etc/nginx/nginx.conf \
--sbin-path=/usr/sbin/nginx \
--pid-path=/run/nginx.pid \
--lock-path=/run/lock/nginx.lock \
--http-log-path=/var/log/nginx/access.log \
--error-log-path=/var/log/nginx/error.log \
--with-openssl=boringssl \
--with-cc-opt="-I /boringssl/include" \
--with-ld-opt="-L /boringssl/build/ssl -L /boringssl/build/crypto" \
--add-module=nginx-rtmp-module \
--with-http_v3_module \
--with-stream_quic_module \
--with-compat \
--with-debug \
--with-file-aio \
--with-http_addition_module \
--with-http_auth_request_module \
--with-http_dav_module \
--with-http_degradation_module \
--with-http_flv_module \
--with-http_geoip_module \
--with-http_gunzip_module \
--with-http_gzip_static_module \
--with-http_mp4_module \
--with-http_realip_module \
--with-http_secure_link_module \
--with-http_slice_module \
--with-http_ssl_module \
--with-http_stub_status_module \
--with-http_sub_module \
--with-http_v2_module \
--with-mail \
--with-mail_ssl_module \
--with-pcre-jit \
--with-stream \
--with-stream_geoip_module \
--with-stream_realip_module \
--with-stream_ssl_module \
--with-stream_ssl_preread_module \
--with-threads
```

```console
$ touch boringssl/.openssl/include/openssl/ssl.h

$ sudo make

$ sudo make install
```

## NGINX config file

*Obs: Copy server.key and server.crt to /etc/nginx/ssl/*

```nginx
# Server RTMP
rtmp {
    server {
        listen 1935; # Listen RTMP port 1935
        chunk_size 4000;

        application show {
            live on;
            # Use HLS
            hls on;
            # Path to HLS files
            hls_path /mnt/hls/;
            # HLS configs
            hls_fragment 3;
            hls_playlist_length 60;
            # Do not allow client to consume RTMP
            deny play all;
        }
    }
}
# Server HTTP + HLS
http {
    server {
        # Server name and ports
        server_name video.dev;
        listen 443 quic reuseport;
        listen 443 ssl http2;
        
        # Config TLS 1.3
        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;
        ssl_protocols TLSv1.3;
        ssl_early_data on;

        # Header HTTP/3
        add_header alt-svc 'h3-27=":443"; ma=86400';

        location / {
            # Don't use cache or buffer
            proxy_request_buffering off;
            add_header 'Cache-Control' 'no-cache';

            # HTTP
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Expose-Headers' 'Content-Length';

            # HLS configs
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }

            root /mnt/;
        }
    }
}
```

[← Go Back](../README.md)