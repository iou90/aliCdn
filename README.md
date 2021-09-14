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

Action parameters, JSON array with "key" & "value", example: [{ "key": "DomainName", "value": "xxx.xxx.com"}]

## `version`

Sdk version. Default `"2018-05-10"`

## Outputs

## `result`

Sdk invoking result.

## Example usage

Get config id of your cdn domain, and then using it to rewrite the "back_to_origin_url".

```yaml
steps:
  - name: Get Cdn Domain Configs
    uses: iou90/aliCdn
    id: getCdnDomainConfigs
    with:
      accessKeyId: your key id
      appSecret: your key secret
      action: DescribeCdnDomainConfigs
      parameters: '[ { "key": "DomainName", "value": "square.bybutter.com" }, { "key": "FunctionNames", "value": "back_to_origin_url_rewrite" }, ]'
  - name: Set Cdn Action Parameters
    id: setCdnAction
    run: |
      export configId=$result | jq '.DomainConfigs.DomainConfig[0].ConfigId'
      export actionParameters=[{"key":"DomainNames","value":"xxx.xxx.com"},{"key":"Functions","value":[{"functionName":"back_to_origin_url_rewrite","functionArgs":[{"argName":"source_url","argValue":"xxx"},{"argName":"target_url","argValue":"xxx"}],"configId":$configId}]}]
      echo ::set-output name=parameters::$(echo $actionParameters)
    env:
      result: ${{ steps.getCdnDomainConfigs.outputs.result }}
  - name: Rewrite back_to_origin_url
    uses: iou90/aliCdn
    with:
      accessKeyId: your key id
      appSecret: your key secret
      action: BatchSetCdnDomainConfig
      parameters: ${{steps.setCdnAction.parameters}}
```
