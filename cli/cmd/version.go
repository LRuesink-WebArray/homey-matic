package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"homeymatic-cli/version"
)

// versionCmd represents the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Display booster-cli version",
	Long:  "Display booster-cli version",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(version.VERSION)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
