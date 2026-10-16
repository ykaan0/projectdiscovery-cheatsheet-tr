# ==============================================================================
# Çok Araçlı Güvenlik & Keşif Ortamı (ProjectDiscovery Tools + VulnX)
# ==============================================================================
FROM golang:1.22-alpine AS builder

# Gerekli sistem paketleri
RUN apk add --no-cache git gcc musl-dev

# ProjectDiscovery araçlarını kur
RUN go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest && \
    go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Son aşama: Hafif Alpine + Python ortamı
FROM python:3.11-alpine

# Çalışma ortamı gereksinimleri
RUN apk add --no-cache bash bind-tools curl jq ca-certificates git

# Go binary'lerini taşı
COPY --from=builder /go/bin/subfinder /usr/local/bin/subfinder
COPY --from=builder /go/bin/httpx /usr/local/bin/httpx
COPY --from=builder /go/bin/nuclei /usr/local/bin/nuclei

# VulnX kurulumu
WORKDIR /opt/vulnx
RUN git clone --depth 1 https://github.com/anouarbensaad/vulnx.git . && \
    pip install --no-cache-dir -r requirements.txt && \
    ln -s /opt/vulnx/vulnx.py /usr/local/bin/vulnx

# Nuclei şablonlarını önceden indir
RUN nuclei -update-templates

# Çalışma dizini
WORKDIR /workspace

# Varsayılan kabuk
CMD ["/bin/bash"]
