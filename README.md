# upconfig

Small tool for supplying prebuilt web applications with runtime configs

### Usage

**Building runtime config files**
```
upconfig <config-file> [public-dir]
```

**Consuming config files**
```javascript
import {upconfig} from 'upconfig'

const configs = await upconfig()
```

### Examples

```
# multiple configs
upconfig path/to/config.js,path/to/config2.js dist

# reading all configs in a dir
upconfig path/to/config-dir dist

# using an environment variable to resolve a dir
upconfig $MY_CONFIG dist
```