# Guide to SSL

## Install OpenSSL

```console
$ sudo apt update
$ sudo apt install openssl
```
## Create files needed to TLS

```console
$ openssl genrsa -des3 -out rootCA.key 2048
```
```console
$ openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024  -out rootCA.pem
```
```console
$ touch v3.ext
```
Put inside the created file:
```conf
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = video.dev
DNS.2 = video-static.dev
```

```console
$ openssl req -new -nodes -out server.csr -newkey rsa:2048 -keyout server.key
```

```console
$ openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
```

```console
$ openssl pkcs12 -inkey server.key -in server.crt -export -out server.pfx
```

```console
$ sudo cp server.crt /usr/local/share/ca-certificates/
$ sudo update-ca-certificates
```
## Add certificates to Browser

### Firefox
Add *.pem* file to Certificate Manager on settings of firefox.

![Add ssl firefox](/docs/images/firefoxcertman.png)

On *Authorities* edit certificate and *Edit trust*.

![Add trust firefox](/docs/images/firefoxcertmantrust.png)

### Chrome

Add *.pfx* file to *Manage certificates* on settings.

![Add ssl chrome](/docs/images/chromecertman.png)

On *Authorities* edit certificate and *Edit trust*.

![Add trust chrome](/docs/images/chromecertmantrust.png)

[← Go Back](../README.md)