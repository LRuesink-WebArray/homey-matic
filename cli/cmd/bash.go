package cmd

import (
	"github.com/spf13/cobra"
	"os"
)

// bashCmd represents the bash command
var bashCmd = &cobra.Command{
	Use:   "bash",
	Short: "Outpush bask completion functions",
	Long: `Output bash comletion function.
		Use "source <(booster completion bash" to activate.`,
	Run: func(cmd *cobra.Command, args []string) {
		cmd.GenBashCompletion(os.Stdout)
	},
}

func init() {
	completionCmd.AddCommand(bashCmd)
}
