const AWS = require("@aws-sdk/client-dynamodb");
const dynamodb = new AWS.DynamoDB({})

const TABLE_NAME = process.env.GREETINGS_TABLE

exports.create = async (event) => {
    const request = JSON.parse(event.body)

    const warehouses = []

    for (const warehouse of request.warehouses) {
        warehouses.push(
            {
                M: {
                    warehouse: {
                        S: warehouse.warehouse
                    },
                    stock: {
                        N: `${warehouse.stock}`
                    }
                }
            })
    }

    const product = {
        id: {
            S: request.sku
        },
        sku: {
            S: request.sku
        },
        name: {
            S: request.name
        },
        warehouses: {
            L: warehouses
          },
    }

    const response = await create(product)

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

exports.list = async (event) => {
    const response = await list()

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

exports.get = async (event) => {
    const { id } = event.pathParameters

    const response = await get(id)

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

exports.update = async (event) => {
    const { id } = event.pathParameters
    const request = JSON.parse(event.body)

    const warehouses = []

    for (const warehouse of request.warehouses) {
        warehouses.push(
            {
                M: {
                    warehouse: {
                        S: warehouse.warehouse
                    },
                    stock: {
                        N: `${warehouse.stock}`
                    }
                }
            })
    }

    const product = {
        id,
        name: request.name,
        warehouses,
    }

    const response = await update(product)

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

exports.delete = async (event) => {
    const { id } = event.pathParameters

    const response = await remove(id)

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

async function create(product) {
    const params = {
        TableName: TABLE_NAME,
        Item: product
    }

    return await dynamodb.putItem(params)
}

async function list() {
    const params = {
        TableName: TABLE_NAME
    }

    return await dynamodb.scan(params)
}

async function get(id) {
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
            ':id': {
                S: id
            },
        },
        KeyConditionExpression: 'id = :id',
    }

    return await dynamodb.query(params)
}

async function update(product) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: {
                S: product.id,
            }
        },
        UpdateExpression: "set #name = :name, #warehouses = :warehouses",
        ExpressionAttributeNames: {
            "#name": "name",
            "#warehouses": "warehouses",
           },
        ExpressionAttributeValues: {
            ":name": {
                S: product.name
            },
            ":warehouses": {
                L: product.warehouses
            },
        },
        ReturnValues: "ALL_NEW",
    }

    return await dynamodb.updateItem(params)
}

async function remove(id) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: {
                S: id,
            }
        },
    }

    return await dynamodb.deleteItem(params)
}