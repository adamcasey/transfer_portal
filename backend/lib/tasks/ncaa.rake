namespace :ncaa do
  desc 'Import NCAA players into MongoDB'
  task :import, [:dry_run] => :environment do |_task, args|
    dry_run = ActiveModel::Type::Boolean.new.cast(args[:dry_run])
    result = NcaaImporter.new(dry_run: dry_run).run
    puts "Imported #{result[:upserted]} players (dry run: #{dry_run})"
  end

  desc 'Create or update the Atlas Search index used by player autocomplete'
  task search_index: :environment do
    definition = {
      mappings: {
        dynamic: false,
        fields: {
          name: { type: 'autocomplete', tokenization: 'edgeGram', minGrams: 2, maxGrams: 15 },
          position: { type: 'string' },
          classYear: { type: 'string' },
          currentTeam: { type: 'document', fields: { name: { type: 'autocomplete', tokenization: 'edgeGram', minGrams: 2, maxGrams: 15 } } }
        }
      }
    }
    result = PlayerCatalog.players.database.command({ createSearchIndexes: 'players', indexes: [{ name: 'players_search', definition: definition }] })
    puts result.inspect
  end
end
