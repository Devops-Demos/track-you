echo "Location of excel file?" &&
read EXCEL_FILE_LOCATION
echo "Database connection name?"
read DB_CONNECTION
echo "Copying excel file"

if [ -f ./excel-data/data.xlsx ]; then
  rm ./excel-data/data.xlsx
fi

cp $EXCEL_FILE_LOCATION ./excel-data/data.xlsx &&
node ./excel-data/excel-to-json.js
IS_MIGRATION=true
sails console --models.migrate=drop --models.connection=$DB_CONNECTION --orm._hookTimeout=200000 --pubsub._hookTimeout=200000
