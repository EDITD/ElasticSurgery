FROM python:3.7-alpine3.8
LABEL maintainer="dev@edited.com"

# Don't buffer Python output
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Update the latest CA certificates
RUN update-ca-certificates

# Packages we install to compile stuff - these are removed at the end
ARG PACKAGES=' \
    linux-headers gcc \
    libc-dev libffi-dev libressl-dev python3-dev \
'

# Set the work directory
WORKDIR /opt/elasticsurgery

# Add uwsgi config
ADD ./docker/uwsgi.conf /etc/uwsgi.conf

# Bootstrap requirements for install
ADD ./backend/requirements.txt /opt/elasticsurgery/backend/requirements.txt

# Install
RUN echo "Install system packages" && \
    apk add --no-cache \
        curl \
        $PACKAGES && \
    echo "Install Python packages" && \
    pip3 install -r /opt/elasticsurgery/backend/requirements.txt --no-cache-dir && \
    echo "Cleanup system packages" && \
    apk del --purge $PACKAGES

# Add code and set directory
ADD . /opt/elasticsurgery
