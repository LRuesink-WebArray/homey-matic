package template

import (
	"io"
	text_template "text/template"
	"github.com/Masterminds/sprig"
)

func Evaluate(name string, template string, args interface{}, w io.Writer) error {
	funcs := sprig.TxtFuncMap()
	funcs["Iterate"] = func(count uint) []uint {
			var i uint
			var Items []uint
			for i = 1; i <= (count); i++ {
				Items = append(Items, i)
			}
			return Items
		}

	t, err := text_template.New(name).Funcs(funcs).Parse(template)
	if err != nil {
		return err
	}

	err = t.Execute(w, args)
	if err != nil {
		return err
	}
	return nil
}
