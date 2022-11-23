import AWS from "@aws-sdk/client-dynamodb"
const dynamodb = new AWS.Dynamo({})

const TABLE_NAME = process.env.GREETING_TABLE

export const saveHello = async (event) => {
    console.log(event)

    const name = event.queryStringParameters.name

    const item = {
        id: {"S": name},
        name: {"S": name},
        date: {"S": Date.now().toString()}
    }

    console.log(item)

    const saveItem = await saveItem(item)

    return {
        statusCode: 200,
        body: JSON.stringify(saveItem)
    }
}

async function saveItem(item) {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    }

    console.log(params)

    let response = await dynamodb.putItem(params)

    return response
}