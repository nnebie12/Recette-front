import argparse
import json
import sys
import unicodedata
from copy import deepcopy
from pathlib import Path
from urllib import error, request


MEAT_KEYWORDS = {
    'poulet', 'volaille', 'boeuf', 'porc', 'jambon', 'lard', 'saumon',
    'thon', 'crevette', 'crevettes', 'agneau', 'viande', 'poisson',
}

TYPE_RULES = {
    'entree': ['veloute', 'soupe', 'salade', 'entree', 'tartare', 'carpaccio'],
    'dessert': ['dessert', 'gateau', 'tarte', 'mousse', 'tiramisu', 'glace', 'crepe'],
    'plat': ['gratin', 'plat', 'curry', 'tajine', 'pizza', 'pates', 'risotto'],
}

CUSINE_RULES = {
    'francaise': ['veloute', 'gratin', 'quiche', 'bourguignon', 'ratatouille', 'chou-fleur'],
    'italienne': ['pizza', 'pates', 'pasta', 'risotto', 'tiramisu'],
    'japonaise': ['sushi', 'ramen', 'tempura'],
    'mexicaine': ['tacos', 'burrito', 'quesadilla', 'mexicain'],
    'thailandaise': ['thai', 'pad thai', 'curry thai'],
    'americaine': ['burger', 'hotdog', 'pancake'],
}

SEASON_RULES = {
    'HIVER': ['chou-fleur', 'poireau', 'courge', 'potiron', 'pomme de terre'],
    'AUTOMNE': ['champignon', 'courge', 'potiron', 'noix'],
    'PRINTEMPS': ['asperge', 'petits pois', 'fraise'],
    'ETE': ['tomate', 'courgette', 'aubergine', 'basilic'],
}

IMAGE_RULES = {
    'francaise': 'https://loremflickr.com/400/300/french,cuisine',
    'italienne': 'https://loremflickr.com/400/300/italian,pasta',
    'japonaise': 'https://loremflickr.com/400/300/japanese,cuisine',
    'mexicaine': 'https://loremflickr.com/400/300/mexican,cuisine',
    'thailandaise': 'https://loremflickr.com/400/300/thai,cuisine',
    'americaine': 'https://loremflickr.com/400/300/american,food',
    'default': 'https://loremflickr.com/400/300/food,cooking',
}

TARGET_FIELDS = (
    'typeRecette',
    'cuisine',
    'imageUrl',
    'vegetarien',
    'popularite',
    'categorie',
    'saison',
    'typeCuisine',
    'ingredients',
    'commentaires',
    'notes',
)


def normalize(value):
    text = str(value or '').strip().lower()
    text = unicodedata.normalize('NFD', text)
    return ''.join(char for char in text if unicodedata.category(char) != 'Mn')


def infer_from_rules(text, rules, default_value):
    normalized_text = normalize(text)
    for output, keywords in rules.items():
        for keyword in keywords:
            if normalize(keyword) in normalized_text:
                return output
    return default_value


def infer_vegetarian(text):
    normalized_text = normalize(text)
    return not any(keyword in normalized_text for keyword in MEAT_KEYWORDS)


def infer_category(type_recette):
    mapping = {
        'entree': 'Entree',
        'plat': 'Plat principal',
        'dessert': 'Dessert',
    }
    return mapping.get(type_recette, 'Plat principal')


def infer_type_cuisine(cuisine):
    mapping = {
        'francaise': 'traditionnelle',
        'italienne': 'mediterraneenne',
        'japonaise': 'asiatique',
        'mexicaine': 'exotique',
        'thailandaise': 'asiatique',
        'americaine': 'street-food',
    }
    return mapping.get(cuisine, 'traditionnelle')


def infer_ingredients(description):
    if not description:
        return []

    items = [item.strip() for item in description.split(',') if item.strip()]
    return [
        {
            'quantite': '',
            'ingredientName': item,
        }
        for item in items
    ]


def enrich_recipe(recipe):
    enriched = deepcopy(recipe)
    source_text = ' '.join([
        str(recipe.get('titre') or ''),
        str(recipe.get('description') or ''),
    ])

    inferred_type = infer_from_rules(source_text, TYPE_RULES, 'plat')
    inferred_cuisine = infer_from_rules(source_text, CUSINE_RULES, 'francaise')
    inferred_season = infer_from_rules(source_text, SEASON_RULES, 'HIVER')

    defaults = {
        'typeRecette': inferred_type,
        'cuisine': inferred_cuisine,
        'imageUrl': IMAGE_RULES.get(inferred_cuisine, IMAGE_RULES['default']),
        'vegetarien': infer_vegetarian(source_text),
        'popularite': 0,
        'categorie': infer_category(inferred_type),
        'saison': inferred_season,
        'typeCuisine': infer_type_cuisine(inferred_cuisine),
        'ingredients': infer_ingredients(recipe.get('description')),
        'commentaires': [],
        'notes': [],
    }

    for key, value in defaults.items():
        if enriched.get(key) is None:
            enriched[key] = value

    return enriched


def recipe_has_null_fields(recipe):
    return any(recipe.get(field) is None for field in TARGET_FIELDS)


def enrich_recipes(recipes):
    enriched_recipes = []
    updated_count = 0

    for recipe in recipes:
        if recipe_has_null_fields(recipe):
            enriched_recipes.append(enrich_recipe(recipe))
            updated_count += 1
        else:
            enriched_recipes.append(recipe)

    return enriched_recipes, updated_count


def load_recipes_from_file(input_path):
    with Path(input_path).open('r', encoding='utf-8') as handle:
        payload = json.load(handle)

    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        return [payload]

    raise ValueError('Le fichier JSON doit contenir une recette ou une liste de recettes.')


def save_recipes_to_file(recipes, output_path):
    payload = recipes[0] if len(recipes) == 1 else recipes
    with Path(output_path).open('w', encoding='utf-8') as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)


def fetch_recipes_from_api(api_base_url):
    endpoint = f"{api_base_url.rstrip('/')}/v1/recettes/all"
    with request.urlopen(endpoint) as response:
        return json.loads(response.read().decode('utf-8'))


def update_recipe_via_api(api_base_url, recipe):
    recipe_id = recipe.get('id')
    if not recipe_id:
        raise ValueError('Impossible de mettre a jour une recette sans identifiant.')

    endpoint = f"{api_base_url.rstrip('/')}/v1/recettes/{recipe_id}"
    payload = json.dumps(recipe, ensure_ascii=False).encode('utf-8')
    api_request = request.Request(
        endpoint,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='PUT',
    )

    with request.urlopen(api_request) as response:
        return response.status


def parse_args():
    parser = argparse.ArgumentParser(
        description='Enrichit toutes les recettes ayant des champs null.'
    )
    parser.add_argument(
        '--input',
        help='Chemin vers un fichier JSON contenant une recette ou une liste de recettes.',
    )
    parser.add_argument(
        '--output',
        help='Chemin du fichier JSON de sortie. Si absent, le resultat est affiche en console.',
    )
    parser.add_argument(
        '--from-api',
        action='store_true',
        help='Charge les recettes depuis l\'API Spring Boot.',
    )
    parser.add_argument(
        '--apply-api',
        action='store_true',
        help='Met a jour l\'API Spring Boot pour chaque recette enrichie.',
    )
    parser.add_argument(
        '--api-base-url',
        default='http://localhost:8080/api',
        help='Base URL de l\'API backend. Par defaut: http://localhost:8080/api',
    )
    return parser.parse_args()


def resolve_recipes(args):
    if args.from_api:
        return fetch_recipes_from_api(args.api_base_url)
    if args.input:
        return load_recipes_from_file(args.input)

    return [{
        'id': 807,
        'titre': 'Veloute de chou-fleur',
        'description': 'chou-fleur, pomme de terre, eau, bouillon de volaille, origan, poivre, sel, beurre, creme fraiche',
        'tempsPreparation': 35,
        'tempsCuisson': 0,
        'difficulte': 'FACILE',
        'dateCreation': '2026-02-12T12:44:25.228362',
        'recetteMongoId': '698dbd19f21c4c2a863a4a93',
        'typeRecette': None,
        'cuisine': None,
        'imageUrl': None,
        'vegetarien': None,
        'popularite': None,
        'categorie': None,
        'saison': None,
        'typeCuisine': None,
        'userId': 2020,
        'userName': 'Valentin',
        'ingredients': None,
        'commentaires': None,
        'notes': None,
        'moyenneNotes': 0.0,
        'nombreCommentaires': 0,
        'nombreNotes': 0,
    }]


def main():
    args = parse_args()

    try:
        recipes = resolve_recipes(args)
        enriched_recipes, updated_count = enrich_recipes(recipes)

        if args.apply_api:
            for original_recipe, enriched_recipe in zip(recipes, enriched_recipes):
                if original_recipe != enriched_recipe:
                    update_recipe_via_api(args.api_base_url, enriched_recipe)

        if args.output:
            save_recipes_to_file(enriched_recipes, args.output)
        else:
            payload = enriched_recipes[0] if len(enriched_recipes) == 1 else enriched_recipes
            print(json.dumps(payload, ensure_ascii=False, indent=2))

        print(f"\nRecettes analysees : {len(recipes)}", file=sys.stderr)
        print(f"Recettes enrichies : {updated_count}", file=sys.stderr)
    except FileNotFoundError as exc:
        print(f"Fichier introuvable : {exc}", file=sys.stderr)
        sys.exit(1)
    except error.HTTPError as exc:
        print(f"Erreur HTTP {exc.code} : {exc.reason}", file=sys.stderr)
        sys.exit(1)
    except error.URLError as exc:
        print(f"Impossible de joindre l'API : {exc.reason}", file=sys.stderr)
        sys.exit(1)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()