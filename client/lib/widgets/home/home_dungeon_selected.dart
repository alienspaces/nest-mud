import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Application
import 'package:client/logger.dart';
import 'package:client/cubit/character/character_cubit.dart';
import 'package:client/cubit/dungeon/dungeon_cubit.dart';
import 'package:client/repository/repository.dart';

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

  // Global key that uniquely identifies the Form widget
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

    final characterCubit = BlocProvider.of<CharacterCubit>(context);
    CharacterRecord characterRecord = new CharacterRecord(
      name: characterNameController.text,
      strength: strength,
      dexterity: dexterity,
      intelligence: intelligence,
    );

    characterCubit.createCharacter(characterRecord);
  }

  void _incrementStrength() {
    if (strength + dexterity + intelligence <= 35) {
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

  void _incrementDexterity() {
    if (strength + dexterity + intelligence <= 35) {
      setState(() {
        dexterity++;
      });
    }
  }

  void _decrementDexterity() {
    if (dexterity > 8) {
      setState(() {
        dexterity--;
      });
    }
  }

  void _incrementIntelligence() {
    if (strength + dexterity + intelligence <= 35) {
      setState(() {
        intelligence++;
      });
    }
  }

  void _decrementIntelligence() {
    if (intelligence > 8) {
      setState(() {
        intelligence--;
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
    const double attributeFieldLabelWidth = 100;
    const double attributeFieldValueWidth = 50;
    const double attributeFieldSpacerWidth = 80;

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
                crossAxisAlignment: CrossAxisAlignment.center,
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
                    width: 340,
                    margin: EdgeInsets.fromLTRB(0, 10, 0, 10),
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
                    margin: EdgeInsets.fromLTRB(0, 4, 0, 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: fieldHeight,
                          width: attributeFieldLabelWidth,
                          alignment: Alignment.centerLeft,
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
                          width: attributeFieldValueWidth,
                          alignment: Alignment.center,
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
                        Container(
                          height: fieldHeight,
                          width: attributeFieldSpacerWidth,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.fromLTRB(0, 4, 0, 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: fieldHeight,
                          width: attributeFieldLabelWidth,
                          alignment: Alignment.centerLeft,
                          child: Text('Dexterity'),
                        ),
                        Container(
                          height: fieldHeight,
                          child: ElevatedButton(
                            onPressed: () {
                              _decrementDexterity();
                            },
                            child: const Text('<'),
                          ),
                        ),
                        Container(
                          height: fieldHeight,
                          width: attributeFieldValueWidth,
                          alignment: Alignment.center,
                          child: Text('${dexterity}'),
                        ),
                        Container(
                          height: fieldHeight,
                          child: ElevatedButton(
                            onPressed: () {
                              _incrementDexterity();
                            },
                            child: const Text('>'),
                          ),
                        ),
                        Container(
                          height: fieldHeight,
                          width: attributeFieldSpacerWidth,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.fromLTRB(0, 4, 0, 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: fieldHeight,
                          width: attributeFieldLabelWidth,
                          alignment: Alignment.centerLeft,
                          child: Text('Intelligence'),
                        ),
                        Container(
                          height: fieldHeight,
                          child: ElevatedButton(
                            onPressed: () {
                              _decrementIntelligence();
                            },
                            child: const Text('<'),
                          ),
                        ),
                        Container(
                          height: fieldHeight,
                          width: attributeFieldValueWidth,
                          alignment: Alignment.center,
                          child: Text('${intelligence}'),
                        ),
                        Container(
                          height: fieldHeight,
                          child: ElevatedButton(
                            onPressed: () {
                              _incrementIntelligence();
                            },
                            child: const Text('>'),
                          ),
                        ),
                        Container(
                          height: fieldHeight,
                          width: attributeFieldSpacerWidth,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: fieldHeight,
                    width: 200,
                    margin: EdgeInsets.fromLTRB(0, 10, 0, 10),
                    child: ElevatedButton(
                      onPressed: () {
                        // Validate returns true if the form is valid, or false otherwise.
                        if (_formKey.currentState!.validate()) {
                          _createCharacter();
                        }
                      },
                      child: const Text('Enter The Dungeon'),
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
