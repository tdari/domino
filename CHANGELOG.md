# v0.8.0

### Features
* Install missing repositories from Workflows Gallery modal when importing a workflow [PR #180].
* Create default user `admin@email.com`, password `admin` when platform is created [Issue #177].
* Add search bar for Pieces in Workflows Editor page [Issue #168].
* Workflows gallery with more examples and easy installation fo repositories.
* Installing multiple repositories on a new workspace if platform `github_token` provide.


### Fixes
* Improved terminal messages for `domino platform run-compose` and `domino platform stop-compose` CLI.
* Add optional platform level github token in `run-in-compose` CLI [Issue #176].
* Fix token expiration date bug [Issue #147].
* Fix validation bugs.
* Performance improved on `create_piece_repository`
* Allow for optional secrets.



# v0.7.0

### Features
* Added `CHANGELOG.md` file to track changes between releases. [PR #156](https://github.com/Tauffer-Consulting/domino/pull/156)
* Import workflows from `My Workflows`. [PR #146](https://github.com/Tauffer-Consulting/domino/pull/146)


### Fixes
* Fixes for the migration to Pydantic 2. [PR #152](https://github.com/Tauffer-Consulting/domino/pull/152)
* Remove old docs files. [PR #156](https://github.com/Tauffer-Consulting/domino/pull/156)