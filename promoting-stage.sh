parse_json()
{
    echo $1 | \
    sed -e 's/[{}]/''/g' | \
    sed -e 's/", "/'\",\"'/g' | \
    sed -e 's/" ,"/'\",\"'/g' | \
    sed -e 's/" , "/'\",\"'/g' | \
    sed -e 's/","/'\"---SEPERATOR---\"'/g' | \
    awk -F=':' -v RS='---SEPERATOR---' "\$1~/\"$2\"/ {print}" | \
    sed -e "s/\"$2\"://" | \
    tr -d "\n\t" | \
    sed -e 's/\\"/"/g' | \
    sed -e 's/\\\\/\\/g' | \
    sed -e 's/^[ \t]*//g' | \
    sed -e 's/^"//'  -e 's/"$//'
}

ORIGINAL_STAGE="uat-env";
PROMOTING_STAGE="stag1-env";

while getopts .o:p:. OPTION

do
    case $OPTION in
        o) 
        if [[ $OPTARG ]]; then
          ORIGINAL_STAGE=$OPTARG
        fi
            ;;
        p)
        if [[ $OPTARG ]]; then
          PROMOTING_STAGE=$OPTARG
        fi
            ;;
        esac
done

set -x
git checkout "${ORIGINAL_STAGE}"
git pull
git checkout "${PROMOTING_STAGE}"
git merge "${ORIGINAL_STAGE}"
git push