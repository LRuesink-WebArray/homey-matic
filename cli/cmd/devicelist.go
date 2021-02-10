package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"homeymatic-cli/pkg/devicelist"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"sort"
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

		g := devicelist.NewGenerator()
		deviceList, err := g.Generate(driverDir)
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
