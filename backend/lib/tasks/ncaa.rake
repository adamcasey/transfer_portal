namespace :ncaa do
  desc 'Import FBS football stat leaders from henrygd/ncaa-api'
  task :import, [:dry_run] => :environment do |_task, args|
    dry_run = args[:dry_run].to_s == 'true'
    result = NcaaImporter.new(dry_run: dry_run).run
    puts JSON.pretty_generate(result)
    abort('NCAA import failed') if result[:status] == 'failed'
  end
end

namespace :espn do
  desc 'Import full FBS rosters from ESPN (all active players on all D1A teams)'
  task :import, [:dry_run] => :environment do |_task, args|
    dry_run = args[:dry_run].to_s == 'true'
    result = EspnImporter.new(dry_run: dry_run).run
    puts JSON.pretty_generate(result)
    abort('ESPN import failed') if result[:status] == 'failed'
  end
end
