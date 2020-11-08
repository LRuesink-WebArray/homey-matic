package cmd

import (
	"github.com/spf13/cobra"
	"os"
)

// zshCmd represents the zsh command
var zshCmd = &cobra.Command{
	Use:   "zsh",
	Short: "Outpush zsh completion functions",
	Long: `Output zsh comletion function.
		Use "source <(booster completion zsh" to activate.`,
	Run: func(cmd *cobra.Command, args []string) {
		_ = cmd.GenZshCompletion(os.Stdout)
	},
}

func init() {
	completionCmd.AddCommand(zshCmd)
}
