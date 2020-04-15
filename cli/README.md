# Homematic-cli

The cli is used to create a template for a new driver.

# Prequiresites

- go-bindata (available in Ubuntu, Fedora and Manajro package repo)

# Build

```
# go generate ./... && go build [-o ~/bin/homeymatic-cli ]
```

# Auto completion

## ZSH with oh-my-zsh

```
homeymatic-cli completion zsh >~/.oh-my-zsh/completions/_homeymatic-cli
```

# Examples

## Driver

Driver with buttons
```
homeymatic-cli driver -n HM-PB-6-WM55 -d ~/Development/homey/homey-matic/drivers -b 6
```

Driver without buttons
```
homeymatic-cli driver -n HM-PB-6-WM55 -d ~/Development/homey/homey-matic/drivers
```
