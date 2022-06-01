
FROM mysql:5.7

# Create a config directory
RUN mkdir -p /usr/config

WORKDIR "/usr/config"

COPY . .

COPY ./movementsTracker.sql /docker-entrypoint-initdb.d
RUN sleep 7
EXPOSE 3306
#RUN /bin/bash -c "/usr/bin/mysqld_safe --skip-grant-tables &" && \
#    sleep 5 && \
#    mysql -u root -e "DROP DATABASE IF EXISTS movementsTracker;CREATE DATABASE movementsTracker;" && \
#    #DROP DATABASE IF EXISTS
#    mysql -u root movementsTracker < /usr/config/movementsTracker.sql
#RUN  mysql -u root movementsTracker < /usr/config/movementsTracker.sql

# Grant permissions for to our scripts to be executable
#RUN chmod +x /usr/config/configure-db.sh
#
#ENTRYPOINT ["./entrypoint.sh"]