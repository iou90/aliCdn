# aliCloud cdn action

This action provides aliCloud cdn sdk.

## Inputs

## `accessKeyId`

**Required** Access key id.

## `appSecret`

**Required** App secret.

## `action`

**Required** Action name.

## `parameters`

Action parameters, JSON array with "key" & "value", example: { "DomainName": "xxx.xxx.com", "FunctionNames": "back_to_origin_url_rewrite" }.

## `version`

Sdk version. Default `"2018-05-10"`.

## Outputs

## `result`

Sdk invoking result.

## Example usage
Ali cloud cdn api reference: https://help.aliyun.com/product/27099.html


Get config id of your cdn domain, and then using it to rewrite the "back_to_origin_url".

```yaml
steps:
  - name: Get Cdn Domain Configs
    uses: iou90/aliCdn@v1.0.0
    id: getCdnDomainConfigs
    with:
      accessKeyId: accessKeyId
      appSecret: appSecret
      action: DescribeCdnDomainConfigs
      parameters: '{ "DomainName": "xxx.xxx.com", "FunctionNames": "back_to_origin_url_rewrite" }'
  - name: Set Cdn Action Parameters
    id: setCdnAction
    run: |
      export configId=$(echo $result | jq '.DomainConfigs.DomainConfig[0].ConfigId')
      echo $configId
      export target_url=xxx
      export functionsValue=$(printf '[{"functionName":"back_to_origin_url_rewrite","functionArgs":[{"argName":"source_url","argValue":"source_url"},{"argName":"target_url","argValue":%s}],"configId":%s}]' $target_url $configId) 
      export normalizedFunctions=$(echo $functionsValue | jq --raw-input)
      export actionParameters=$(printf '{ "DomainNames": "xxx.xxx.com", "Functions": %s }' $normalizedFunctions)
      echo $actionParameters
      echo ::set-output name=parameters::$(echo $actionParameters)
    env:
      result: ${{ steps.getCdnDomainConfigs.outputs.result }}
  - name: Rewrite back_to_origin_url
    uses: iou90/aliCdn@v1.0.0
    with:
      accessKeyId: accessKeyId
      appSecret: appSecret
      action: BatchSetCdnDomainConfig
      parameters:  ${{ steps.setCdnAction.outputs.parameters }}
```
