package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"text/template"
)

var baseDir string
var devicesRegex *regexp.Regexp

type templateVars struct {
	DeviceList []string
}

var genReadmeCmd = &cobra.Command{
	Use:   "gen-readme",
	Short: "Generate README with list of all supported devices",
	Long:  `Generate README with list of all supported devices.`,
	Run: func(cmd *cobra.Command, args []string) {
		devicesRegex = regexp.MustCompile("this.homematicTypes.*=.*?\\[(.*)\\]")
		driverDir := filepath.Join(baseDir, "drivers")
		readmeTemplatePath := filepath.Join(baseDir, "README.template")
		readmePath := _filePath(baseDir, "README.md")

		vars := templateVars{}

		deviceList, err := walkDir(driverDir)
		if err != nil {
			panic(err)
		}

		sort.Strings(deviceList)
		vars.DeviceList = deviceList

		readmeFd, err := os.Create(readmePath)
		if err != nil {
			panic(err)
		}

		err = genReadme(readmeTemplatePath, &vars, readmeFd)
		if err != nil {
			fmt.Println(err)
		}
	},
}

func walkDir(dir string) ([]string, error) {
	deviceList := make([]string, 0)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if info.Name() != "driver.js" {
			return nil
		}

		content, err := ioutil.ReadFile(path)
		if err != nil {
			return fmt.Errorf("Failed to read file %s: %s", path, err)
		}

		groups := devicesRegex.FindSubmatch(content)
		if len(groups) <= 1 {
			return fmt.Errorf("Could not find devices in %s", path)
		}

		raw := string(groups[1])
		raw = strings.ReplaceAll(raw, "'", "")
		raw = strings.ReplaceAll(raw, " ", "")

		list := strings.Split(raw, ",")
		deviceList = append(deviceList, list...)

		return nil
	})
	if err != nil {
		return nil, err
	}

	return deviceList, nil
}

func genReadme(tmplPath string, vars *templateVars, out io.Writer) error {
	t, err := template.ParseFiles(tmplPath)
	if err != nil {
		return err
	}

	err = t.Execute(out, vars)
	return err
}

func init() {
	rootCmd.AddCommand(genReadmeCmd)

	genReadmeCmd.Flags().StringVarP(&baseDir, "base-dir", "d", ".", "Path of home-matic repo")
}
