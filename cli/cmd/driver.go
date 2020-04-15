package cmd

import (
	"fmt"
	template2 "homeymatic-cli/pkg/template"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

const driverAssetPath string = "data/driver"

var numberButtons uint
var driverName, driverClass string
var driverOutputDir string
var capablities []string

type driverParams struct {
	DriverName    string
	DriverClass   string
	Capabilities  []string
	NumberButtons uint
}

//go:generate go-bindata -pkg cmd data/...
var driverCmd = &cobra.Command{
	Use:   "driver",
	Short: "Create driver",
	Long:  `Create all the required files for a driver.`,
	Run: func(cmd *cobra.Command, args []string) {
		driverArgs := driverParams{
			DriverName:    driverName,
			DriverClass:   driverClass,
			Capabilities:  capablities,
			NumberButtons: numberButtons,
		}

		processAssets(driverOutputDir, driverAssetPath, driverArgs)
	},
}

func processAssets(dir, name string, driverArgs driverParams) {
	children, err := AssetDir(name)
	if err != nil {
		filename := strings.Replace(name, driverAssetPath, "", 1)

		if strings.HasSuffix(filename, "driver.flow.compose.json") && numberButtons == 0 {
			return
		}

		filename = fmt.Sprintf("%s/%s", driverName, filename)
		filename = path.Join(dir, filename)

		dir := path.Dir(filename)
		os.MkdirAll(dir, 0755)

		f, err := os.Create(filename)
		if err != nil {
			panic(err)
		}

		byteTemplate, err := Asset(name)
		if err != nil {
			panic(err)
		}

		err = template2.Evaluate(name, string(byteTemplate), driverArgs, f)
		if err != nil {
			panic(err)
		}

		f.Close()
	}

	for _, child := range children {
		processAssets(dir, filepath.Join(name, child), driverArgs)
	}

}

func init() {
	rootCmd.AddCommand(driverCmd)

	driverCmd.Flags().StringVarP(&driverName, "name", "n", "", "Name of the driver to create")
	_ = driverCmd.MarkFlagRequired("name")
	driverCmd.Flags().StringVarP(&driverClass, "class", "c", "", "Class of the device in driver.compose.json")
	_ = driverCmd.MarkFlagRequired("class")
	driverCmd.Flags().StringVarP(&driverOutputDir, "output-dir", "d", "", "Output directory under which driver will be created")
	_ = driverCmd.MarkFlagRequired("output-dir")
	driverCmd.Flags().UintVarP(&numberButtons, "buttons", "b", 0, "Number of buttons")
	driverCmd.Flags().StringSliceVar(&capablities, "capabilities", []string{}, "List of capabilities")
}
