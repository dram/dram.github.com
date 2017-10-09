#!/bin/sh

export PGDATA="$(dirname "$(readlink -f "$0")")/data"

case $1 in
    init)
	pg_ctl init
	cat >>"$PGDATA/postgresql.conf" <<EOF
listen_addresses = ''
logging_collector = on
unix_socket_directories = '.'
EOF
	pg_ctl start
	;;
    shell)
	psql -s postgres
	;;
    start)
	pg_ctl start
	;;
    stop)
	pg_ctl stop
	;;
    *)
	echo "Unknown command"
	;;
esac
