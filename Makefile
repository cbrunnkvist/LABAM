DIR=$(shell basename `pwd`)

release: build/LABAM.zip
	@echo Archive created: $(PWD)/build/LABAM.zip

build/LABAM.zip: build *
	cd ../ ; zip -FS -r $(PWD)/build/LABAM.zip $(DIR) -x$(DIR)/build/* -x$(DIR)/.git/*

build:
	mkdir -p build

clean:
	rm -r build
