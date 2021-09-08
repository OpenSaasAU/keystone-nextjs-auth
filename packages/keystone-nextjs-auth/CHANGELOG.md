# @opensaas-keystone/nextjs-auth

## 13.0.1

### Patch Changes

- fb84793: next 11 fixes for next-config

## 13.0.0

### Major Changes

- e5d413a: Keystone Version upgrade to 25.0.0

## 12.0.2

### Patch Changes

- d17f159: fix #25 - `publicPages` not added correctly

## 12.0.1

### Patch Changes

- 49f3922: update readme with new instructions

## 12.0.0

### Major Changes

- 3b9b9e8: map publicPages to providers to allow the auto addition of callback and signin URLs to the `publicPages` array in keystone. This requires providers to mvoe to the `createAuth` configuration which probably make more sense anyway. See readme for new configuration.
- decb7d1: Upgrade keystone-next to 24 with latest API upgrades

## 11.1.0

### Minor Changes

- f79ceab: Add endSession to clean next-auth cookie

## 11.0.0

### Major Changes

- 664f8c2: Upgrade keystone packages

## 10.0.3

### Patch Changes

- 0d8cc8a: Feat: Add google provider paths to the keystone public pages config

## 10.0.2

### Patch Changes

- 2d5f594: version bump

## 10.0.1

### Patch Changes

- 5175fc9: Fix error from findMany in findMatchingIdentities

## 10.0.0

### Major Changes

- 05de370: Change session data to be stored in JWT to reduce db load on session lookup

## 9.1.0

### Minor Changes

- Make keystonePath optional

## 9.0.0

### Major Changes

- Add keystone base path

## 8.1.4

### Patch Changes

- Fix up some more types

## 8.1.3

### Patch Changes

- update types

## 8.1.2

### Patch Changes

- Comment update

## 8.1.1

### Patch Changes

- Fix updateOne error

## 8.1.0

### Minor Changes

- https://github.com/keystonejs/keystone/pull/6022/files

## 8.0.0

### Major Changes

- upgrade keystone

## 7.0.0

### Major Changes

- Fix up providers config

## 6.3.0

### Minor Changes

- Change return in session

## 6.2.0

### Minor Changes

- next-config error fix

## 6.1.0

### Minor Changes

- fix next-config error

## 6.0.0

### Major Changes

- Auto add and next config

## 5.0.0

### Major Changes

- enable autoadd hooked in with keystone lists

## 4.2.0

### Minor Changes

- For error

## 4.1.0

### Minor Changes

- Fix forEach error

## 4.0.0

### Major Changes

- update babel and remove some logging

## 3.0.0

### Major Changes

- fix up a few errors

## 2.1.0

### Minor Changes

- Add readme

## 2.0.0

### Major Changes

- c0d53b8: initial
