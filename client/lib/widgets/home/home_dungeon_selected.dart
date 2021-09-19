import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/repository/dungeon/dungeon_repository.dart';

class HomeDungeonSelectedWidget extends StatefulWidget {
  final DungeonRecord dungeonRecord;
  const HomeDungeonSelectedWidget({Key? key, required this.dungeonRecord}) : super(key: key);

  @override
  _HomeDungeonSelectedWidgetState createState() => _HomeDungeonSelectedWidgetState();
}

class _HomeDungeonSelectedWidgetState extends State<HomeDungeonSelectedWidget> {
  int strength = 8;
  int dexterity = 8;
  int intelligence = 8;

  // Create a global key that uniquely identifies the Form widget
  // and allows validation of the form.
  //
  // Note: This is a `GlobalKey<FormState>`,
  // not a GlobalKey<MyCustomFormState>.
  final _formKey = GlobalKey<FormState>();

  // Form field controllers
  final characterNameController = TextEditingController();

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    characterNameController.dispose();
    super.dispose();
  }

  void _createCharacter() {
    final log = getLogger('HomeDungeonSelectedWidget');
    log.info('Creating character name >${characterNameController.text}<');
    log.info('Creating character strength >${strength}<');
    log.info('Creating character dexterity >${dexterity}<');
    log.info('Creating character intelligence >${intelligence}<');
  }

  void _incrementStrength() {
    if (strength + dexterity + intelligence <= 32) {
      setState(() {
        strength++;
      });
    }
  }

  void _decrementStrength() {
    if (strength > 8) {
      setState(() {
        strength--;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final log = getLogger('HomeDungeonSelectedWidget');
    log.info('Building..');

    InputDecoration _fieldDecoration(String hintText) {
      return InputDecoration(
        border: OutlineInputBorder(),
        hintText: hintText,
      );
    }

    const double fieldHeight = 50;

    return BlocConsumer<DungeonCubit, DungeonState>(
      listener: (BuildContext context, DungeonState state) {
        //
      },
      builder: (BuildContext context, DungeonState state) {
        if (state is DungeonStateUpdated && state.currentDungeonRecord != null) {
          // TODO: Build a character form here and a create button
          // to create a character in the current selected dungeon
          return Container(
            margin: EdgeInsets.fromLTRB(20, 10, 20, 10),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Container(
                    height: fieldHeight,
                    child: Text('Create Character'),
                  ),
                  Container(
                    height: fieldHeight,
                    child: Text('${widget.dungeonRecord.id} ${widget.dungeonRecord.name}'),
                  ),
                  Container(
                    height: fieldHeight,
                    child: TextFormField(
                      controller: characterNameController,
                      autofocus: true,
                      decoration: _fieldDecoration('Character Name'),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter character name';
                        }
                        return null;
                      },
                    ),
                  ),
                  Container(
                    child: Row(
                      children: <Widget>[
                        Container(
                          height: fieldHeight,
                          child: Text('Strength'),
                        ),
                        Container(
                          height: fieldHeight,
                          child: ElevatedButton(
                            onPressed: () {
                              _decrementStrength();
                            },
                            child: const Text('<'),
                          ),
                        ),
                        Container(
                          height: fieldHeight,
                          child: Text('${strength}'),
                        ),
                        Container(
                          height: fieldHeight,
                          child: ElevatedButton(
                            onPressed: () {
                              _incrementStrength();
                            },
                            child: const Text('>'),
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Container(
                  //   height: fieldHeight,
                  //   child: Row(
                  //     mainAxisSize: MainAxisSize.max,
                  //     mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  //     children: <Widget>[
                  //       Container(
                  //         height: fieldHeight,
                  //         child: Text('Strength'),
                  //       ),
                  //     ],
                  //   ),
                  // ),
                  Container(
                    height: fieldHeight,
                    child: TextFormField(
                      controller: characterNameController,
                      autofocus: true,
                      decoration: _fieldDecoration(''),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter character name';
                        }
                        return null;
                      },
                    ),
                  ),
                  Container(
                    height: fieldHeight,
                    child: TextFormField(
                      controller: characterNameController,
                      autofocus: true,
                      decoration: _fieldDecoration(''),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter character name';
                        }
                        return null;
                      },
                    ),
                  ),
                  Container(
                    child: ElevatedButton(
                      onPressed: () {
                        // Validate returns true if the form is valid, or false otherwise.
                        if (_formKey.currentState!.validate()) {
                          _createCharacter();
                        }
                      },
                      child: const Text('Submit'),
                    ),
                  ),
                ],
              ),
            ),
          );
        }

        // Shouldn't get here..
        return Container();
      },
    );
  }
}
