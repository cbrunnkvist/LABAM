# name the uploadable archive
ARCHIVE=LABAM.zip
###################

DIR=$(shell basename `pwd`)

release: build/$(ARCHIVE)
	@echo Archive created: $(PWD)/build/$(ARCHIVE)

build/$(ARCHIVE): build *
	cd ../ ; zip -FS -r $(PWD)/build/$(ARCHIVE) $(DIR) -x$(DIR)/build/* -x$(DIR)/.git/*

build:
	mkdir -p build

clean:
	rm -r build
