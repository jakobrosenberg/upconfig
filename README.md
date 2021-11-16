# upconfig

### Small tool for supplying prebuilt web applications with runtime configs

## The problem
Since prebuilt web apps traditionally are served directly to the client browser,
there's no way to provide custom configurations at runtime.

Up config patches the index.html and injects your config or javascript at runtime

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