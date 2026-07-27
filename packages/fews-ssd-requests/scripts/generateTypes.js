import { compile } from 'json-schema-to-typescript'
import fs from 'node:fs'

const config = {
  url: 'https://fewsdocs.deltares.nl/webservices/ssd/schemas/ssd',
  message: '/* tslint:disable */',
}

const ssdSchemas = [
  {
    url: `${config.url}/pi_ssd_get_action.json`,
    output: 'src/response/action/ssdActionResponse.ts',
  },
  {
    url: `${config.url}/pi_ssd_get_capabilities.json`,
    output: 'src/response/capabilities/ssdCapabilitiesResponse.ts',
  },
  {
    url: `${config.url}/pi_ssd_get_feature_info.json`,
    output: 'src/response/featureinfo/ssdFeatureInfoResponse.ts',
  }
]

const generateTypes = async (schemas) => {
  for (const schema of schemas) {
    try {
      const response = await fetch(schema.url)
      const data = await response.json()
      const ts = await compile(data, schema.output, {
        bannerComment: config.message,
      })
      fs.writeFileSync(schema.output, ts)
    } catch (error) {
      console.error(`Error processing file ${schema.url}: ${error}`)
    }
  }
}

const type = process.argv[2]

const run = async () => {
  if (type === 'ssd') {
    await generateTypes(ssdSchemas)
  } else {
    console.error('Invalid argument. Use "ssd".')
  }
}

await run()
