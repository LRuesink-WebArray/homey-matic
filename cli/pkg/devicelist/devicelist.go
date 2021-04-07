package devicelist

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type Generator struct {
	deviceList   []string
	devicesRegex *regexp.Regexp
}

func NewGenerator() *Generator {
	return &Generator{
		deviceList:   []string{},
		devicesRegex: regexp.MustCompile("this.homematicTypes.*=.*?\\[(.*)\\]"),
	}
}

func (g *Generator) Generate(dir string) ([]string, error) {
	const driverFile = "driver.js"

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if info.Name() != driverFile {
			return nil
		}

		devices, err := g.processFile(path)
		if err != nil {
			return err
		}

		g.deviceList = append(g.deviceList, devices...)

		return nil
	})
	if err != nil {
		return nil, err
	}

	return g.deviceList, nil
}

func (g *Generator) processFile(path string) ([]string, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("Failed to read file %s: %s", path, err)
	}
	defer f.Close()

	list, err := g.driverDevices(f)
	if err != nil {
		return nil, fmt.Errorf("Failed to get devices for %s: %s", path, err)
	}

	return list, nil
}

func (g *Generator) driverDevices(r io.Reader) ([]string, error) {
	content, err := ioutil.ReadAll(r)
	if err != nil {
		fmt.Errorf("Failed to read driver content: %s", err)
	}

	groups := g.devicesRegex.FindSubmatch(content)
	if len(groups) <= 1 {
		return nil, fmt.Errorf("Could not find devices")
	}

	raw := string(groups[1])
	raw = strings.ReplaceAll(raw, "'", "")
	raw = strings.ReplaceAll(raw, " ", "")

	return strings.Split(raw, ","), nil
}
