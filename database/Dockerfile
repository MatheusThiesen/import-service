FROM postgres
ENV POSTGRES_USER dev
ENV POSTGRES_PASSWORD dev
ENV POSTGRES_DB importservice
# ADD ./scripts/*.sql /docker-entrypoint-initdb.d/
RUN echo "America/Sao_Paulo" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata